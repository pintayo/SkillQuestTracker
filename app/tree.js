import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { loadSkills } from '../utils/storage';
import { SKILL_CONNECTIONS } from '../data/userSkills';
import Svg, { Line } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NODE_SIZE = 70;
const SPACING_X = 100;
const SPACING_Y = 120;

export default function SkillTreeScreen() {
  const [skills, setSkills] = useState([]);

  const loadData = async () => {
    const loadedSkills = await loadSkills();
    if (loadedSkills) {
      setSkills(loadedSkills);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getNodePosition = (skill) => {
    // Convert relative position to screen coordinates
    const centerX = SCREEN_WIDTH / 2;
    const x = centerX + (skill.position.x * SPACING_X);
    const y = 150 + (skill.position.y * SPACING_Y);
    return { x, y };
  };

  const getProgressPercentage = (skill) => {
    return Math.min((skill.currentHours / skill.targetHours) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView
          contentContainerStyle={styles.treeContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Connections */}
          <Svg
            height={600}
            width={SCREEN_WIDTH + 400}
            style={styles.svg}
          >
            {SKILL_CONNECTIONS.map((connection, index) => {
              const fromSkill = skills.find(s => s.id === connection.from);
              const toSkill = skills.find(s => s.id === connection.to);

              if (!fromSkill || !toSkill) return null;

              const fromPos = getNodePosition(fromSkill);
              const toPos = getNodePosition(toSkill);

              const isUnlocked = !toSkill.locked;

              return (
                <Line
                  key={index}
                  x1={fromPos.x + NODE_SIZE / 2}
                  y1={fromPos.y + NODE_SIZE / 2}
                  x2={toPos.x + NODE_SIZE / 2}
                  y2={toPos.y + NODE_SIZE / 2}
                  stroke={isUnlocked ? '#3498db' : '#bdc3c7'}
                  strokeWidth={3}
                  strokeDasharray={isUnlocked ? '0' : '5,5'}
                />
              );
            })}
          </Svg>

          {/* Skill Nodes */}
          {skills.map((skill) => {
            const position = getNodePosition(skill);
            const progress = getProgressPercentage(skill);
            const isLocked = skill.locked;

            return (
              <View
                key={skill.id}
                style={[
                  styles.skillNode,
                  {
                    left: position.x,
                    top: position.y,
                  },
                  isLocked && styles.skillNodeLocked
                ]}
              >
                {/* Progress Ring */}
                <View style={styles.progressRing}>
                  <View
                    style={[
                      styles.progressRingFill,
                      {
                        backgroundColor: isLocked ? '#bdc3c7' : progress === 100 ? '#27ae60' : '#3498db'
                      }
                    ]}
                  >
                    {/* Inner circle */}
                    <View style={styles.progressRingInner}>
                      <Text style={styles.skillNodeIcon}>{skill.icon}</Text>
                    </View>
                  </View>
                </View>

                {/* Lock Overlay */}
                {isLocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}

                {/* Skill Name */}
                <Text style={styles.skillNodeName}>{skill.name}</Text>

                {/* Progress */}
                <Text style={styles.skillNodeProgress}>
                  {skill.currentHours.toFixed(1)}h / {skill.targetHours}h
                </Text>

                {/* Progress Percentage */}
                {!isLocked && (
                  <Text style={[
                    styles.skillNodePercentage,
                    progress === 100 && styles.skillNodeComplete
                  ]}>
                    {progress.toFixed(0)}%
                  </Text>
                )}
              </View>
            );
          })}

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Legend</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3498db' }]} />
              <Text style={styles.legendText}>In Progress</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#27ae60' }]} />
              <Text style={styles.legendText}>Completed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#bdc3c7' }]} />
              <Text style={styles.legendText}>Locked</Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  treeContainer: {
    width: SCREEN_WIDTH + 400,
    minHeight: 600,
    paddingTop: 50,
    paddingBottom: 100,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  skillNode: {
    position: 'absolute',
    width: NODE_SIZE,
    alignItems: 'center',
  },
  skillNodeLocked: {
    opacity: 0.6,
  },
  progressRing: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressRingFill: {
    width: NODE_SIZE - 4,
    height: NODE_SIZE - 4,
    borderRadius: (NODE_SIZE - 4) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingInner: {
    width: NODE_SIZE - 12,
    height: NODE_SIZE - 12,
    borderRadius: (NODE_SIZE - 12) / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillNodeIcon: {
    fontSize: 32,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: NODE_SIZE,
    height: NODE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: NODE_SIZE / 2,
  },
  lockIcon: {
    fontSize: 24,
  },
  skillNodeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    maxWidth: NODE_SIZE + 20,
  },
  skillNodeProgress: {
    fontSize: 10,
    color: '#7f8c8d',
    marginTop: 2,
  },
  skillNodePercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    marginTop: 4,
  },
  skillNodeComplete: {
    color: '#27ae60',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});
