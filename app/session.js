import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { loadSkills, logSession } from '../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';

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
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Gradient Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.iconCircle}>
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Text style={styles.skillIcon}>{skill.icon}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={styles.skillSubtitle}>Training Session</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Timer Display */}
        <View style={styles.timerCard}>
          <View style={styles.timerCircle}>
            <LinearGradient
              colors={isRunning ? ['#667eea', '#764ba2'] : ['#e0e0e0', '#c4c4c4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.timerGradient}
            >
              <View style={styles.timerInner}>
                <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                <Text style={styles.timerLabel}>
                  {isRunning ? '⏱️ Training' : seconds > 0 ? 'Paused' : 'Ready'}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleStartStop}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isRunning ? ['#f093fb', '#f5576c'] : ['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.controlButtonGradient}
              >
                <Text style={styles.controlButtonText}>
                  {isRunning ? '⏸ PAUSE' : seconds > 0 ? '▶ RESUME' : '▶ START'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{skill.currentHours.toFixed(1)}h</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{skill.targetHours}h</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{skill.sessions.length}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Notes Input */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>📝 Session Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How did it go? Any breakthroughs?"
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Complete Button */}
        {seconds >= 60 && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#52c234', '#4caf50']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeButtonGradient}
            >
              <Text style={styles.completeButtonText}>✓ COMPLETE SESSION</Text>
              <Text style={styles.completeButtonSubtext}>
                {Math.floor(seconds / 60)} minutes logged
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillIcon: {
    fontSize: 40,
  },
  skillName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  skillSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 32,
  },
  timerGradient: {
    width: 220,
    height: 220,
    borderRadius: 110,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerInner: {
    width: 204,
    height: 204,
    borderRadius: 102,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a2e',
    fontVariant: ['tabular-nums'],
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
  },
  controlRow: {
    width: '100%',
  },
  controlButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  controlButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  notesInput: {
    fontSize: 15,
    color: '#1a1a2e',
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 0,
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#52c234',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  completeButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  completeButtonSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
});
