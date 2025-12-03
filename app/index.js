import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getNextRecommendedSkill, getLastTrainedSkill, loadSkills } from '../utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [recommendedSkill, setRecommendedSkill] = useState(null);
  const [lastSkill, setLastSkill] = useState(null);
  const [stats, setStats] = useState({ totalHours: 0, unlockedSkills: 0 });

  const loadData = async () => {
    const recommended = await getNextRecommendedSkill();
    const last = await getLastTrainedSkill();
    const skills = await loadSkills();

    setRecommendedSkill(recommended);
    setLastSkill(last);

    if (skills) {
      const totalHours = skills.reduce((sum, s) => sum + s.currentHours, 0);
      const unlocked = skills.filter(s => !s.locked).length;
      setStats({ totalHours: totalHours.toFixed(1), unlockedSkills: unlocked });
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleStartSession = () => {
    if (recommendedSkill) {
      router.push({
        pathname: '/session',
        params: { skillId: recommendedSkill.id }
      });
    }
  };

  const handleViewTree = () => {
    router.push('/tree');
  };

  if (!recommendedSkill) {
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SkillQuest</Text>
        <Text style={styles.subtitle}>Become a Jack of All Trades</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalHours}</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.unlockedSkills}/15</Text>
            <Text style={styles.statLabel}>Skills Unlocked</Text>
          </View>
        </View>

        {/* Today's Quest */}
        <View style={styles.questCard}>
          <Text style={styles.questTitle}>TODAY'S QUEST</Text>

          <View style={styles.skillDisplay}>
            <Text style={styles.skillIcon}>{recommendedSkill.icon}</Text>
            <Text style={styles.skillName}>{recommendedSkill.name}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(recommendedSkill.currentHours / recommendedSkill.targetHours) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {recommendedSkill.currentHours.toFixed(1)} / {recommendedSkill.targetHours} hours
            </Text>
          </View>

          {recommendedSkill.locked && (
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedText}>🔒 Locked</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.startButton, recommendedSkill.locked && styles.startButtonDisabled]}
            onPress={handleStartSession}
            disabled={recommendedSkill.locked}
          >
            <Text style={styles.startButtonText}>START NOW</Text>
          </TouchableOpacity>
        </View>

        {/* Last Session */}
        {lastSkill && (
          <View style={styles.lastSessionCard}>
            <Text style={styles.lastSessionTitle}>Last Trained</Text>
            <View style={styles.lastSessionContent}>
              <Text style={styles.lastSessionIcon}>{lastSkill.icon}</Text>
              <Text style={styles.lastSessionName}>{lastSkill.name}</Text>
            </View>
            {lastSkill.sessions.length > 0 && (
              <Text style={styles.lastSessionDate}>
                {new Date(lastSkill.sessions[lastSkill.sessions.length - 1].date).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}

        {/* View Skill Tree Button */}
        <TouchableOpacity
          style={styles.treeButton}
          onPress={handleViewTree}
        >
          <Text style={styles.treeButtonText}>🌳 View Skill Tree</Text>
        </TouchableOpacity>
      </ScrollView>
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
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 15,
    letterSpacing: 1,
  },
  skillDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  skillIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  skillName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  lockedBadge: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 15,
  },
  lockedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  lastSessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  lastSessionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 10,
  },
  lastSessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lastSessionIcon: {
    fontSize: 32,
  },
  lastSessionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  lastSessionDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  treeButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  treeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
