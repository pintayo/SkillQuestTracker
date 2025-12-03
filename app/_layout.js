import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { INITIAL_USER_SKILLS } from '../data/userSkills';
import { loadSkills, saveSkills } from '../utils/storage';

export default function RootLayout() {
  useEffect(() => {
    // Initialize skills on first launch
    const initializeSkills = async () => {
      const existingSkills = await loadSkills();
      if (!existingSkills) {
        await saveSkills(INITIAL_USER_SKILLS);
      }
    };

    initializeSkills();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'SkillQuest',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="session"
        options={{
          title: 'Training Session',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="tree"
        options={{
          title: 'Skill Tree'
        }}
      />
    </Stack>
  );
}
