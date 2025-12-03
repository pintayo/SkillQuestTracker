/**
 * AsyncStorage utilities for persisting user data
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@skillquest_data';

export const saveSkills = async (skills) => {
  try {
    const jsonValue = JSON.stringify(skills);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving skills:', e);
    return false;
  }
};

export const loadSkills = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading skills:', e);
    return null;
  }
};

export const logSession = async (skillId, durationMinutes, notes = '') => {
  try {
    const skills = await loadSkills();
    if (!skills) return false;

    const skillIndex = skills.findIndex(s => s.id === skillId);
    if (skillIndex === -1) return false;

    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: durationMinutes,
      notes,
    };

    skills[skillIndex].sessions.push(session);
    skills[skillIndex].currentHours += durationMinutes / 60;

    // Check if this unlocks any skills
    skills.forEach(skill => {
      if (skill.locked && skill.unlockedBy === skillId) {
        const parentSkill = skills.find(s => s.id === skillId);
        if (parentSkill.currentHours >= skill.unlockedAt) {
          skill.locked = false;
        }
      }
    });

    await saveSkills(skills);
    return true;
  } catch (e) {
    console.error('Error logging session:', e);
    return false;
  }
};

export const getLastTrainedSkill = async () => {
  try {
    const skills = await loadSkills();
    if (!skills) return null;

    let lastSkill = null;
    let lastDate = 0;

    skills.forEach(skill => {
      if (skill.sessions.length > 0) {
        const lastSession = skill.sessions[skill.sessions.length - 1];
        const sessionDate = new Date(lastSession.date).getTime();
        if (sessionDate > lastDate) {
          lastDate = sessionDate;
          lastSkill = skill;
        }
      }
    });

    return lastSkill;
  } catch (e) {
    console.error('Error getting last skill:', e);
    return null;
  }
};

export const getNextRecommendedSkill = async () => {
  try {
    const skills = await loadSkills();
    if (!skills) return null;

    // Get unlocked skills
    const unlockedSkills = skills.filter(s => !s.locked);

    // Sort by least practiced
    unlockedSkills.sort((a, b) => a.currentHours - b.currentHours);

    // Return the skill with least hours
    return unlockedSkills[0] || null;
  } catch (e) {
    console.error('Error getting recommended skill:', e);
    return null;
  }
};
