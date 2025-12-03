import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { INITIAL_USER_SKILLS } from '../data/userSkills';
import { loadSkills, saveSkills } from '../utils/storage';

export default function RootLayout() {
  useEffect(() => {
    // Initialize skills on first launch
    const initializeSkills = async () => {
      try {
        console.log('Initializing skills...');
        const existingSkills = await loadSkills();
        console.log('Existing skills:', existingSkills ? 'Found' : 'Not found');

        if (!existingSkills || existingSkills.length === 0) {
          console.log('Saving initial skills:', INITIAL_USER_SKILLS.length);
          const saved = await saveSkills(INITIAL_USER_SKILLS);
          console.log('Skills saved:', saved);

          // Verify
          const verified = await loadSkills();
          console.log('Verification - skills loaded:', verified?.length || 0);
        }
      } catch (error) {
        console.error('Error initializing skills:', error);
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
