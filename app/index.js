import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getNextRecommendedSkill, getLastTrainedSkill, loadSkills } from '../utils/storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const [recommendedSkill, setRecommendedSkill] = useState(null);
  const [lastSkill, setLastSkill] = useState(null);
  const [stats, setStats] = useState({ totalHours: 0, unlockedSkills: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const recommended = await getNextRecommendedSkill();
      const last = await getLastTrainedSkill();
      const skills = await loadSkills();

      console.log('Loaded skills:', skills?.length || 0);
      console.log('Recommended skill:', recommended?.name);

      setRecommendedSkill(recommended);
      setLastSkill(last);

      if (skills) {
        const totalHours = skills.reduce((sum, s) => sum + s.currentHours, 0);
        const unlocked = skills.filter(s => !s.locked).length;
        setStats({ totalHours: totalHours.toFixed(1), unlockedSkills: unlocked });
      }

      // Smooth fade-in animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 10,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
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

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading || !recommendedSkill) {
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
        <Text style={styles.loadingSubtext}>Preparing your quest</Text>
      </View>
    );
  }

  const progressPercentage = Math.round((recommendedSkill.currentHours / recommendedSkill.targetHours) * 100);

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
        <Text style={styles.title}>SkillQuest</Text>
        <Text style={styles.subtitle}>Your Journey to Mastery</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{stats.totalHours}</Text>
                <Text style={styles.statLabel}>Hours Logged</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.statGradient}
              >
                <Text style={styles.statValue}>{stats.unlockedSkills}/15</Text>
                <Text style={styles.statLabel}>Unlocked</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Today's Quest - Main Card */}
          <View style={styles.questCard}>
            <View style={styles.questBadgeContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.questBadge}
              >
                <Text style={styles.questBadgeText}>TODAY'S QUEST</Text>
              </LinearGradient>
            </View>

            <View style={styles.skillDisplay}>
              <View style={styles.iconCircle}>
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Text style={styles.skillIcon}>{recommendedSkill.icon}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.skillName}>{recommendedSkill.name}</Text>
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBar, { width: `${progressPercentage}%` }]}
                />
              </View>
              <Text style={styles.progressText}>
                {recommendedSkill.currentHours.toFixed(1)}h / {recommendedSkill.targetHours}h
              </Text>
            </View>

            {/* Start Button */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartSession}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>START NOW</Text>
                <Text style={styles.startButtonArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Last Session Card */}
          {lastSkill && (
            <View style={styles.lastSessionCard}>
              <Text style={styles.sectionTitle}>Last Training</Text>
              <View style={styles.lastSessionContent}>
                <View style={styles.lastIconCircle}>
                  <Text style={styles.lastSessionIcon}>{lastSkill.icon}</Text>
                </View>
                <View style={styles.lastSessionInfo}>
                  <Text style={styles.lastSessionName}>{lastSkill.name}</Text>
                  {lastSkill.sessions.length > 0 && (
                    <Text style={styles.lastSessionDate}>
                      {new Date(lastSkill.sessions[lastSkill.sessions.length - 1].date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Skill Tree Button */}
          <TouchableOpacity
            style={styles.treeButton}
            onPress={handleViewTree}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#a8edea', '#fed6e3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.treeButtonGradient}
            >
              <Text style={styles.treeButtonIcon}>🌳</Text>
              <Text style={styles.treeButtonText}>View Skill Tree</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    color: '#e74c3c',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  questBadgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  questBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  questBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.2,
  },
  skillDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillIcon: {
    fontSize: 48,
  },
  skillName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 13,
    color: '#6c757d',
    textAlign: 'center',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  startButtonArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  lastSessionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lastSessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  lastIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastSessionIcon: {
    fontSize: 32,
  },
  lastSessionInfo: {
    flex: 1,
  },
  lastSessionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  lastSessionDate: {
    fontSize: 13,
    color: '#6c757d',
  },
  treeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#a8edea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  treeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  treeButtonIcon: {
    fontSize: 24,
  },
  treeButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
  },
});
