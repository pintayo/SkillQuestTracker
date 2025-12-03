import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { loadSkills, logSession } from '../utils/storage';

export default function SessionScreen() {
  const router = useRouter();
  const { skillId } = useLocalSearchParams();
  const [skill, setSkill] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadSkill = async () => {
      const skills = await loadSkills();
      const foundSkill = skills?.find(s => s.id === skillId);
      setSkill(foundSkill);
    };

    loadSkill();
  }, [skillId]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleComplete = async () => {
    if (seconds < 60) {
      Alert.alert('Too Short', 'Please train for at least 1 minute before logging.');
      return;
    }

    const durationMinutes = Math.floor(seconds / 60);

    Alert.alert(
      'Complete Session?',
      `Log ${durationMinutes} minutes of ${skill?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            const success = await logSession(skillId, durationMinutes, notes);
            if (success) {
              Alert.alert('Success!', `Logged ${durationMinutes} minutes`, [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]);
            } else {
              Alert.alert('Error', 'Failed to log session');
            }
          }
        }
      ]
    );
  };

  if (!skill) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Skill Display */}
        <View style={styles.skillHeader}>
          <Text style={styles.skillIcon}>{skill.icon}</Text>
          <Text style={styles.skillName}>{skill.name}</Text>
          <Text style={styles.skillSubtitle}>Training Session</Text>
        </View>

        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <Text style={styles.timerLabel}>
            {isRunning ? 'Training...' : 'Ready to start'}
          </Text>
        </View>

        {/* Start/Stop Button */}
        <TouchableOpacity
          style={[styles.controlButton, isRunning && styles.stopButton]}
          onPress={handleStartStop}
        >
          <Text style={styles.controlButtonText}>
            {isRunning ? 'PAUSE' : seconds > 0 ? 'RESUME' : 'START'}
          </Text>
        </TouchableOpacity>

        {/* Notes Input */}
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Session Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How did it go? Any progress?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Complete Button */}
        {seconds >= 60 && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>✓ COMPLETE SESSION</Text>
          </TouchableOpacity>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statItemValue}>{skill.currentHours.toFixed(1)}h</Text>
            <Text style={styles.statItemLabel}>Current Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statItemValue}>{skill.targetHours}h</Text>
            <Text style={styles.statItemLabel}>Target</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statItemValue}>{skill.sessions.length}</Text>
            <Text style={styles.statItemLabel}>Sessions</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  skillHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  skillIcon: {
    fontSize: 72,
    marginBottom: 15,
  },
  skillName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  skillSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2c3e50',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: '#e67e22',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  completeButton: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statItemLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
});
