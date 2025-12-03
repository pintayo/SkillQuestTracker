# SkillQuest Tracker

A smart skill progression app that **eliminates decision paralysis** by calculating optimal learning paths based on skill transfer and accessibility.

## 🎯 The Problem It Solves

**"Too many choices = I do nothing"**

When you want to learn many skills (skateboarding, skiing, horse riding, etc.), it's overwhelming to decide:
- Which skill to start with?
- Which skills have the most overlap?
- What order makes the most sense?
- What should I practice today?

## 💡 The Solution

SkillQuest Tracker uses a **smart prioritization algorithm** that:

1. **Analyzes skill transfer** - Calculates which skills unlock others (e.g., skateboarding makes snowboarding 75% easier)
2. **Checks accessibility** - Only recommends skills you can start immediately (near Arnhem, affordable, year-round)
3. **Generates optimal path** - Picks 3 foundation skills that give you the best base for everything else
4. **Eliminates daily decisions** - App tells you exactly what to practice each day

## 🏆 Your Optimal Path (Based on Algorithm)

### Phase 1: Foundation Skills (Start Now)
**Total: 130 hours (~7 months at 5hrs/week)**

1. **Skateboarding** (50 hours)
   - Unlocks: Snowboarding (+75%), Surfing (+60%), Roller Blading (+50%)
   - Cost: ~€100 for board
   - Where: Any skatepark in Arnhem

2. **Snowboarding** (40 hours)
   - Unlocks: Skiing (+70%), Surfing (+65%)
   - Cost: ~€50/session rental
   - Where: SnowWorld Landgraaf (1.5hrs away)

3. **Car Driving** (40 hours)
   - Unlocks: Motorbike (+50%), Drifting (+60%), Racing (+65%)
   - Cost: Included in lessons
   - Where: Local driving schools in Arnhem

**Result:** These 3 skills provide foundation for **10 out of 15** of your target skills (67% coverage)

### Phase 2: Accelerated Learning (After Phase 1)
**Total: 320 hours**

Skills that become 50-70% easier after Phase 1:
- Skiing (70% easier)
- Surfing (63% easier)
- Roller Blading (50% easier)
- Motorbike Driving (50% easier)
- Drifting (60% easier)
- Racing (65% easier)

### Phase 3: Independent Skills (Anytime)
**Total: 220 hours**

Skills with minimal overlap (learn whenever):
- Horse Riding
- Skydiving
- Ice Skating
- Ballroom Dancing
- Rock Climbing
- Bouldering

## 📱 How The App Works

### 1. Onboarding (One-Time Setup)
- Add your dream skills (skateboarding, skiing, etc.)
- Algorithm calculates optimal path
- Accept the plan

### 2. Daily Use (Zero Decisions)
```
┌─────────────────────────┐
│   TODAY'S QUEST         │
│                         │
│  🛹 Skateboarding       │
│  Practice for 30 min    │
│                         │
│  Progress: 12/50 hours  │
│  ━━━━━━░░░░░░░░ 24%    │
│                         │
│  ┌───────────────────┐  │
│  │ START THIS NOW    │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

- Open app → See ONE task
- Tap "START THIS NOW"
- Timer starts automatically
- Complete and log session
- Done! Close app.

### 3. Progressive Unlocks
As you complete hours, new skills unlock:
- 50hrs skateboarding → Snowboarding becomes available
- Get car license → Drifting unlocks
- Complete Phase 1 → Phase 2 skills unlock

## 🧠 Algorithm Logic

```javascript
// Simplified version
function calculateOptimalPath(skills) {
  1. For each skill, calculate total transfer value
     Example: Skateboarding transfers to 4 skills = high value

  2. Check accessibility (can start now? near Arnhem? affordable?)

  3. Combine scores: 60% transfer value + 40% accessibility

  4. Pick top 3 skills from different categories

  5. Group remaining skills into phases based on boosted-by relationships
}
```

## 🚀 Tech Stack

- **Frontend:** React Native + Expo
- **Navigation:** Expo Router
- **UI:** React Native Paper
- **Storage:** AsyncStorage (MVP) → Supabase later
- **Algorithm:** Pure JavaScript (Node.js)

## 📁 Project Structure

```
SkillQuestTracker/
├── app/                            # React Native app screens
│   ├── _layout.js                 # Navigation setup
│   ├── index.js                   # Home screen
│   ├── session.js                 # Timer screen
│   └── tree.js                    # Skill tree visualization
├── src/
│   ├── algorithm/
│   │   ├── skillPrioritizer.js    # Core algorithm
│   │   └── testRunner.js          # Test with your skills
│   └── data/
│       └── skillDatabase.js       # 15 skills with transfer matrix
├── data/
│   └── userSkills.js              # User's skill configuration
├── utils/
│   └── storage.js                 # AsyncStorage utilities
├── app.json                       # Expo config
├── package.json
├── APP_GUIDE.md                   # Instagram content guide
└── README.md
```

## 🧪 Testing The Algorithm

Run the algorithm with your 15 skills:

```bash
npm run test-algorithm
```

This will show you:
- Recommended foundation skills
- What each skill unlocks
- Learning phases breakdown
- Timeline estimates
- Local venues near Arnhem

## 📊 Key Stats

- **Total Skills:** 15
- **Foundation Skills:** 3
- **Coverage:** 67% (10/15 skills)
- **Total Hours:** 670 hours
- **Timeline:** ~17 months at 10hrs/week

## 🚀 Getting Started

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the app:**
```bash
npm start
```

3. **Run on device:**
- Scan QR code with Expo Go app (iOS/Android)
- Or press `i` for iOS simulator, `a` for Android emulator

### Testing Algorithm

Run the smart prioritization algorithm:
```bash
npm run test-algorithm
```

## 📱 App Features

### ✅ Implemented Features

- **Home Screen**: Shows today's quest with "START NOW" button
- **Session Timer**: Track practice time with notes
- **Skill Tree**: Visual progress tree with unlock system
- **Progress Tracking**: Hours logged, progress percentages
- **Auto-Unlock**: Skills unlock when prerequisites complete
- **Local Storage**: All data saved locally

### 🔜 Future Features

- Push notifications for daily reminders
- Supabase cloud sync
- Achievement system
- Venue integration (SnowWorld, etc.)
- Social sharing
- Calendar integration

## 💭 Design Philosophy

1. **Zero-Decision Mode** - App decides, you execute
2. **One Task At A Time** - No browsing, no choices
3. **Pre-Commitment** - Plan once, run automatically
4. **Progressive Disclosure** - Locked skills prevent overwhelm
5. **Immediate Action** - Timer auto-starts, no delays

## 🎯 Success Criteria

You'll know the app works when:
- ✅ You open it and immediately know what to do
- ✅ You never have to decide "what should I practice?"
- ✅ You see progress bars filling up
- ✅ Skills unlock as you complete foundations
- ✅ You actually DO the activities instead of planning them

## 📸 Instagram Content Strategy

See [APP_GUIDE.md](./APP_GUIDE.md) for:
- Video script templates
- Screenshot timing tips
- Content posting schedule
- Week-by-week strategy
- Caption ideas

**Perfect for:** "Day X Learning [Skill]" Instagram series!

---

## 🎬 Quick Start for Instagram

1. Buy skateboard (€100)
2. Record first session
3. Open app and log session
4. Screenshot progress
5. Post "Day 1 of becoming a jack of all trades"

**Built to solve decision paralysis through algorithmic prioritization** 🚀
