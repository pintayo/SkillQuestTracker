/**
 * SkillQuest Tracker - Smart Prioritization Algorithm
 * Calculates optimal learning paths based on skill transfer and accessibility
 */

const { SKILL_DATABASE } = require('../data/skillDatabase');

/**
 * Main function: Generate optimal learning path
 */
function generateOptimalLearningPath(desiredSkills) {
  console.log(`\n🎯 Analyzing ${desiredSkills.length} skills...\n`);

  // Step 1: Validate all skills exist
  const validSkills = desiredSkills.filter(skill => {
    if (!SKILL_DATABASE[skill]) {
      console.warn(`⚠️  Skill "${skill}" not found in database, skipping`);
      return false;
    }
    return true;
  });

  // Step 2: Calculate transfer scores for each skill
  const transferScores = calculateTransferScores(validSkills);

  // Step 3: Calculate accessibility scores
  const accessibilityScores = calculateAccessibilityScores(validSkills);

  // Step 4: Combine scores to find keystone skills
  const keystoneSkills = findKeystoneSkills(validSkills, transferScores, accessibilityScores);

  // Step 5: Group skills into categories
  const skillCategories = groupSkillsByCategory(validSkills);

  // Step 6: Build learning phases
  const learningPhases = buildLearningPhases(validSkills, keystoneSkills, transferScores);

  // Step 7: Calculate what each phase unlocks
  const unlockMap = calculateUnlocks(validSkills, keystoneSkills);

  return {
    totalSkills: validSkills.length,
    keystoneSkills,
    transferScores,
    accessibilityScores,
    skillCategories,
    learningPhases,
    unlockMap
  };
}

/**
 * Calculate how much value each skill provides through transfers
 */
function calculateTransferScores(desiredSkills) {
  const scores = {};

  desiredSkills.forEach(skillId => {
    const skill = SKILL_DATABASE[skillId];
    let totalTransfer = 0;
    let skillsHelped = 0;

    // Check how many of the desired skills this one transfers to
    if (skill.transfersTo) {
      Object.entries(skill.transfersTo).forEach(([targetSkill, percentage]) => {
        if (desiredSkills.includes(targetSkill)) {
          totalTransfer += percentage;
          skillsHelped++;
        }
      });
    }

    scores[skillId] = {
      totalTransfer,
      skillsHelped,
      averageTransfer: skillsHelped > 0 ? totalTransfer / skillsHelped : 0
    };
  });

  return scores;
}

/**
 * Score skills by how accessible they are
 */
function calculateAccessibilityScores(desiredSkills) {
  const scores = {};

  const availabilityScore = {
    'immediate': 100,
    'local-venue': 80,
    'local-school': 80,
    'regional': 50,
    'specialty-venue': 40,
    'travel-required': 20
  };

  const seasonScore = {
    'year-round': 100,
    'spring-fall': 70,
    'winter-or-indoor': 80,
    'summer': 60,
    'winter': 40
  };

  desiredSkills.forEach(skillId => {
    const skill = SKILL_DATABASE[skillId];
    const acc = skill.accessibility;

    // Calculate composite accessibility score
    const availScore = availabilityScore[acc.availability] || 50;
    const seasonalScore = seasonScore[acc.season] || 50;
    const costScore = acc.equipmentCost > 200 ? 30 :
                     acc.equipmentCost > 100 ? 50 :
                     acc.equipmentCost > 50 ? 70 : 100;

    // Check if it has prerequisites
    const hasPrereqs = skill.requires && skill.requires.length > 0;
    const prereqPenalty = hasPrereqs ? 0.5 : 1.0;

    const totalScore = ((availScore + seasonalScore + costScore) / 3) * prereqPenalty;

    scores[skillId] = {
      totalScore: Math.round(totalScore),
      availability: availScore,
      seasonal: seasonalScore,
      cost: costScore,
      hasPrerequisites: hasPrereqs,
      prerequisites: skill.requires || []
    };
  });

  return scores;
}

/**
 * Find the best foundation skills (high transfer + high accessibility)
 */
function findKeystoneSkills(desiredSkills, transferScores, accessibilityScores) {
  const combined = desiredSkills.map(skillId => {
    const transfer = transferScores[skillId];
    const access = accessibilityScores[skillId];
    const skill = SKILL_DATABASE[skillId];

    // Combined score: 60% transfer value, 40% accessibility
    const combinedScore = (transfer.totalTransfer * 0.6) + (access.totalScore * 0.4);

    return {
      skillId,
      name: skill.name,
      combinedScore,
      transferValue: transfer.totalTransfer,
      skillsHelped: transfer.skillsHelped,
      accessibility: access.totalScore,
      difficulty: skill.difficulty,
      targetHours: skill.targetHours,
      canStartNow: access.totalScore > 60 && !access.hasPrerequisites
    };
  });

  // Sort by combined score
  combined.sort((a, b) => b.combinedScore - a.combinedScore);

  // Pick top skills that can start immediately
  const immediateStarters = combined.filter(s => s.canStartNow);

  // Try to get 3-4 foundation skills from different categories
  const foundations = [];
  const usedCategories = new Set();

  for (const skill of immediateStarters) {
    const category = SKILL_DATABASE[skill.skillId].category;

    // Prefer diverse categories
    if (!usedCategories.has(category) || foundations.length < 3) {
      foundations.push(skill);
      usedCategories.add(category);
    }

    if (foundations.length >= 4) break;
  }

  return {
    all: combined,
    foundations: foundations.slice(0, 3), // Top 3
    delayed: combined.filter(s => !s.canStartNow)
  };
}

/**
 * Group skills by category for visualization
 */
function groupSkillsByCategory(desiredSkills) {
  const categories = {};

  desiredSkills.forEach(skillId => {
    const skill = SKILL_DATABASE[skillId];
    const cat = skill.category;

    if (!categories[cat]) {
      categories[cat] = [];
    }

    categories[cat].push({
      skillId,
      name: skill.name
    });
  });

  return categories;
}

/**
 * Build learning phases
 */
function buildLearningPhases(desiredSkills, keystoneSkills, transferScores) {
  const phases = [];

  // Phase 1: Foundation skills (can start now, highest transfer)
  const phase1 = keystoneSkills.foundations.map(f => {
    const skill = SKILL_DATABASE[f.skillId];
    return {
      skillId: f.skillId,
      name: skill.name,
      targetHours: skill.targetHours,
      reasoning: `Unlocks ${f.skillsHelped} other skills with ${Math.round(f.transferValue / f.skillsHelped)}% avg transfer`
    };
  });

  phases.push({
    phase: 1,
    name: "Foundation Skills",
    description: "Start immediately - these give you the most leverage",
    skills: phase1,
    totalHours: phase1.reduce((sum, s) => sum + s.targetHours, 0)
  });

  // Phase 2: Skills unlocked by foundations (boosted by phase 1)
  const phase1SkillIds = phase1.map(s => s.skillId);
  const phase2Skills = [];

  desiredSkills.forEach(skillId => {
    if (phase1SkillIds.includes(skillId)) return; // Already in phase 1

    const skill = SKILL_DATABASE[skillId];

    // Check if this skill is boosted by any phase 1 skill
    if (skill.boostedBy) {
      const boosts = Object.entries(skill.boostedBy)
        .filter(([booster, _]) => phase1SkillIds.includes(booster))
        .map(([booster, percentage]) => ({
          skill: SKILL_DATABASE[booster].name,
          percentage
        }));

      if (boosts.length > 0) {
        const avgBoost = boosts.reduce((sum, b) => sum + b.percentage, 0) / boosts.length;

        phase2Skills.push({
          skillId,
          name: skill.name,
          targetHours: skill.targetHours,
          boostedBy: boosts,
          averageBoost: Math.round(avgBoost),
          reasoning: `${Math.round(avgBoost)}% easier after completing Phase 1`
        });
      }
    }
  });

  if (phase2Skills.length > 0) {
    phases.push({
      phase: 2,
      name: "Accelerated Learning",
      description: "These become significantly easier after Phase 1",
      skills: phase2Skills,
      totalHours: phase2Skills.reduce((sum, s) => sum + s.targetHours, 0)
    });
  }

  // Phase 3: Seasonal/Advanced (needs prerequisites or seasonal)
  const phase2SkillIds = phase2Skills.map(s => s.skillId);
  const phase3Skills = [];

  desiredSkills.forEach(skillId => {
    if (phase1SkillIds.includes(skillId) || phase2SkillIds.includes(skillId)) return;

    const skill = SKILL_DATABASE[skillId];
    const acc = skill.accessibility;

    // Skills that need specific seasons or prerequisites
    if (skill.requires || acc.availability === 'travel-required' || acc.availability === 'specialty-venue') {
      phase3Skills.push({
        skillId,
        name: skill.name,
        targetHours: skill.targetHours,
        requires: skill.requires || [],
        reasoning: skill.requires ?
          `Requires: ${skill.requires.map(r => SKILL_DATABASE[r]?.name || r).join(', ')}` :
          `${acc.availability} - ${acc.season}`
      });
    }
  });

  if (phase3Skills.length > 0) {
    phases.push({
      phase: 3,
      name: "Advanced & Seasonal",
      description: "After mastering foundations, tackle these specialized skills",
      skills: phase3Skills,
      totalHours: phase3Skills.reduce((sum, s) => sum + s.targetHours, 0)
    });
  }

  // Phase 4: Independent skills (no transfer benefit)
  const allAssignedIds = [...phase1SkillIds, ...phase2SkillIds, ...phase3Skills.map(s => s.skillId)];
  const phase4Skills = desiredSkills
    .filter(skillId => !allAssignedIds.includes(skillId))
    .map(skillId => {
      const skill = SKILL_DATABASE[skillId];
      return {
        skillId,
        name: skill.name,
        targetHours: skill.targetHours,
        reasoning: "Independent skill - learn anytime"
      };
    });

  if (phase4Skills.length > 0) {
    phases.push({
      phase: 4,
      name: "Independent Skills",
      description: "These can be learned anytime - minimal overlap with others",
      skills: phase4Skills,
      totalHours: phase4Skills.reduce((sum, s) => sum + s.targetHours, 0)
    });
  }

  return phases;
}

/**
 * Calculate what completing each phase unlocks
 */
function calculateUnlocks(desiredSkills, keystoneSkills) {
  const unlockMap = {};

  keystoneSkills.foundations.forEach(foundation => {
    const skill = SKILL_DATABASE[foundation.skillId];
    const unlocks = [];

    if (skill.transfersTo) {
      Object.entries(skill.transfersTo).forEach(([targetSkillId, percentage]) => {
        if (desiredSkills.includes(targetSkillId)) {
          unlocks.push({
            skillId: targetSkillId,
            name: SKILL_DATABASE[targetSkillId].name,
            transferPercentage: percentage
          });
        }
      });
    }

    unlockMap[foundation.skillId] = unlocks;
  });

  return unlockMap;
}

module.exports = {
  generateOptimalLearningPath,
  calculateTransferScores,
  calculateAccessibilityScores
};
