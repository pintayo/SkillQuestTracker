/**
 * SkillQuest Tracker - Test Runner
 * Runs the algorithm with user's skill list and displays results
 */

const { generateOptimalLearningPath } = require('./skillPrioritizer');
const { SKILL_DATABASE } = require('../data/skillDatabase');

// User's desired skills
const USER_SKILLS = [
  'skateboarding',
  'skiing',
  'horse-riding',
  'skydiving',
  'snowboarding',
  'surfing',
  'ice-skating',
  'roller-blading',
  'ballroom-dancing',
  'car-driving',
  'motorbike-driving',
  'drifting',
  'racing',
  'rock-climbing',
  'bouldering'
];

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           SKILLQUEST TRACKER - ALGORITHM TEST                  ║');
console.log('╚════════════════════════════════════════════════════════════════╝');

console.log('\n📋 YOUR DREAM SKILL LIST:');
console.log('─────────────────────────────────────');
USER_SKILLS.forEach((skill, i) => {
  const skillData = SKILL_DATABASE[skill];
  console.log(`${i + 1}. ${skillData?.name || skill}`);
});

// Run the algorithm
const result = generateOptimalLearningPath(USER_SKILLS);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    ANALYSIS COMPLETE                           ║');
console.log('╚════════════════════════════════════════════════════════════════╝');

// Display keystones
console.log('\n🎯 RECOMMENDED FOUNDATION SKILLS (Start with these 3):');
console.log('═══════════════════════════════════════════════════════════════');

result.keystoneSkills.foundations.forEach((foundation, i) => {
  const skill = SKILL_DATABASE[foundation.skillId];
  console.log(`\n${i + 1}. 🏆 ${foundation.name.toUpperCase()}`);
  console.log(`   ├─ Target: ${foundation.targetHours} hours to proficiency`);
  console.log(`   ├─ Difficulty: ${skill.difficulty}`);
  console.log(`   ├─ Helps learn: ${foundation.skillsHelped} other skills`);
  console.log(`   ├─ Transfer value: ${Math.round(foundation.transferValue)}% total`);
  console.log(`   ├─ Accessibility: ${foundation.accessibility}/100`);
  console.log(`   └─ Why start here: ${foundation.targetHours}hrs investment unlocks ${foundation.skillsHelped} skills`);

  // Show what it unlocks
  const unlocks = result.unlockMap[foundation.skillId];
  if (unlocks && unlocks.length > 0) {
    console.log(`   └─ 🔓 Unlocks:`);
    unlocks.forEach(unlock => {
      console.log(`      • ${unlock.name} (+${unlock.transferPercentage}% easier)`);
    });
  }

  // Show locations near Arnhem
  if (skill.accessibility.venuesNearArnhem) {
    console.log(`   └─ 📍 Near Arnhem:`);
    skill.accessibility.venuesNearArnhem.forEach(venue => {
      console.log(`      • ${venue}`);
    });
  }
});

// Display learning phases
console.log('\n\n📅 YOUR LEARNING PATH (Phases):');
console.log('═══════════════════════════════════════════════════════════════');

result.learningPhases.forEach(phase => {
  console.log(`\n▶ PHASE ${phase.phase}: ${phase.name.toUpperCase()}`);
  console.log(`  ${phase.description}`);
  console.log(`  Total time: ${phase.totalHours} hours`);
  console.log(`  ────────────────────────────────────`);

  phase.skills.forEach(skill => {
    console.log(`\n  • ${skill.name} (${skill.targetHours}hrs)`);
    console.log(`    └─ ${skill.reasoning}`);

    if (skill.boostedBy) {
      console.log(`    └─ Made easier by:`);
      skill.boostedBy.forEach(boost => {
        console.log(`       • ${boost.skill} (+${boost.percentage}% transfer)`);
      });
    }

    if (skill.requires && skill.requires.length > 0) {
      console.log(`    └─ ⚠️  Prerequisites needed`);
    }
  });
});

// Calculate total coverage
console.log('\n\n📊 COVERAGE ANALYSIS:');
console.log('═══════════════════════════════════════════════════════════════');

const phase1SkillIds = result.learningPhases[0].skills.map(s => s.skillId);
let coveredSkills = new Set(phase1SkillIds);

phase1SkillIds.forEach(skillId => {
  const skill = SKILL_DATABASE[skillId];
  if (skill.transfersTo) {
    Object.keys(skill.transfersTo).forEach(target => {
      if (USER_SKILLS.includes(target)) {
        coveredSkills.add(target);
      }
    });
  }
});

console.log(`\n✅ Phase 1 (3 foundation skills) provides base for:`);
console.log(`   ${coveredSkills.size} out of ${USER_SKILLS.length} total skills (${Math.round(coveredSkills.size / USER_SKILLS.length * 100)}% coverage)`);

// Show skill categories
console.log('\n\n🗂️  SKILL CATEGORIES:');
console.log('═══════════════════════════════════════════════════════════════');

Object.entries(result.skillCategories).forEach(([category, skills]) => {
  const categoryName = category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  console.log(`\n${categoryName}:`);
  skills.forEach(skill => {
    const phase = result.learningPhases.findIndex(p =>
      p.skills.some(s => s.skillId === skill.skillId)
    ) + 1;
    console.log(`  • ${skill.name} (Phase ${phase})`);
  });
});

// Timeline estimate
console.log('\n\n⏱️  TIMELINE ESTIMATE:');
console.log('═══════════════════════════════════════════════════════════════');

let cumulativeHours = 0;
result.learningPhases.forEach(phase => {
  cumulativeHours += phase.totalHours;
  const weeksAt5HrsPerWeek = Math.ceil(phase.totalHours / 5);
  const monthsEstimate = Math.ceil(weeksAt5HrsPerWeek / 4);

  console.log(`\nPhase ${phase.phase}: ${phase.totalHours} hours`);
  console.log(`  └─ ~${weeksAt5HrsPerWeek} weeks at 5hrs/week (${monthsEstimate} months)`);
});

console.log(`\n📈 Total journey: ${cumulativeHours} hours`);
console.log(`   └─ At 5 hours/week: ~${Math.ceil(cumulativeHours / 5 / 4)} months`);
console.log(`   └─ At 10 hours/week: ~${Math.ceil(cumulativeHours / 10 / 4)} months`);

// Key recommendations
console.log('\n\n💡 KEY RECOMMENDATIONS:');
console.log('═══════════════════════════════════════════════════════════════');

console.log('\n1. START IMMEDIATELY with Phase 1 skills:');
result.keystoneSkills.foundations.slice(0, 3).forEach(f => {
  console.log(`   • ${f.name}`);
});

console.log('\n2. ROTATE PRACTICE:');
console.log('   • Focus on 2-3 skills at a time');
console.log('   • Alternate days to avoid burnout');
console.log('   • Example: Mon/Wed/Fri = Skateboarding, Tue/Thu = Ice Skating, Sat = Car Driving');

console.log('\n3. EQUIPMENT PRIORITY:');
const equipmentNeeded = result.keystoneSkills.foundations.map(f => {
  const skill = SKILL_DATABASE[f.skillId];
  return {
    name: f.name,
    cost: skill.accessibility.equipmentCost,
    type: skill.accessibility.equipmentType
  };
}).sort((a, b) => a.cost - b.cost);

equipmentNeeded.forEach(item => {
  if (item.type === 'purchase') {
    console.log(`   • ${item.name}: ~€${item.cost} (buy)`);
  } else if (item.type === 'rental') {
    console.log(`   • ${item.name}: ~€${item.cost}/session (rent)`);
  } else {
    console.log(`   • ${item.name}: Included in lessons`);
  }
});

console.log('\n4. LOCAL VENUES (Arnhem area):');
result.keystoneSkills.foundations.forEach(f => {
  const skill = SKILL_DATABASE[f.skillId];
  if (skill.accessibility.venuesNearArnhem && skill.accessibility.venuesNearArnhem.length > 0) {
    console.log(`   ${f.name}:`);
    skill.accessibility.venuesNearArnhem.slice(0, 2).forEach(venue => {
      console.log(`   └─ ${venue}`);
    });
  }
});

console.log('\n\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                    READY TO START?                             ║');
console.log('╚════════════════════════════════════════════════════════════════╝');

console.log('\nThe app will handle the "what should I do today?" question.');
console.log('Just open it, and it will tell you exactly which skill to practice.');
console.log('\n✨ No more decision paralysis - just execute the plan!\n');
