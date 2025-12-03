/**
 * SkillQuest Tracker - Skill Database
 * Contains all skill definitions with transfer matrices and accessibility data
 */

const SKILL_DATABASE = {
  // ==================== BOARD SPORTS CLUSTER ====================
  skateboarding: {
    name: "Skateboarding",
    category: "board-sports",
    baseAttributes: ["balance", "board-control", "spatial-awareness", "fall-recovery"],
    difficulty: "easy",
    targetHours: 50, // To reach "confident solo" level
    accessibility: {
      equipmentCost: 100, // EUR
      equipmentType: "purchase", // purchase, rental, none
      location: "any-pavement",
      season: "year-round",
      availability: "immediate", // immediate, local-venue, regional, travel-required
      venuesNearArnhem: ["Any skatepark", "Street practice"]
    },
    // Skills this unlocks and transfer percentage
    transfersTo: {
      snowboarding: 75,
      surfing: 60,
      "roller-blading": 50,
      "ice-skating": 40
    },
    description: "Foundation for all board sports. Teaches balance, board feel, and how to fall safely."
  },

  snowboarding: {
    name: "Snowboarding",
    category: "board-sports",
    baseAttributes: ["balance", "edge-control", "board-control", "fall-recovery"],
    difficulty: "medium",
    targetHours: 40,
    accessibility: {
      equipmentCost: 50, // Rental per session
      equipmentType: "rental",
      location: "snow-mountain",
      season: "winter-or-indoor",
      availability: "local-venue",
      venuesNearArnhem: ["SnowWorld Landgraaf (1.5hrs)", "SnowWorld Zoetermeer (1.5hrs)"]
    },
    transfersTo: {
      skiing: 70,
      surfing: 65,
      skateboarding: 50
    },
    boostedBy: {
      skateboarding: 75 // If you know skateboarding, snowboarding learning is 75% faster
    },
    description: "Similar to skateboarding but on snow. Edge control and speed management."
  },

  surfing: {
    name: "Surfing",
    category: "board-sports",
    baseAttributes: ["balance", "board-control", "water-comfort", "timing", "paddling"],
    difficulty: "hard",
    targetHours: 80,
    accessibility: {
      equipmentCost: 30, // Rental per session
      equipmentType: "rental",
      location: "ocean",
      season: "summer",
      availability: "travel-required",
      venuesNearArnhem: ["Scheveningen (1.5hrs)", "Bloemendaal (2hrs)"]
    },
    transfersTo: {
      skateboarding: 40,
      snowboarding: 50
    },
    boostedBy: {
      skateboarding: 60,
      snowboarding: 65
    },
    description: "Hardest board sport. Requires wave reading, paddling strength, and ocean knowledge."
  },

  // ==================== BLADE SPORTS CLUSTER ====================
  "ice-skating": {
    name: "Ice Skating",
    category: "blade-sports",
    baseAttributes: ["balance", "edge-control", "gliding", "single-leg-balance"],
    difficulty: "easy",
    targetHours: 30,
    accessibility: {
      equipmentCost: 10, // Rental per session
      equipmentType: "rental",
      location: "ice-rink",
      season: "winter-or-indoor",
      availability: "local-venue",
      venuesNearArnhem: ["IJssportcentrum Arnhem", "De Scheg Deventer (30min)"]
    },
    transfersTo: {
      "roller-blading": 80,
      "ice-hockey": 70,
      skiing: 40
    },
    description: "Foundation for blade sports. Teaches edge control and gliding balance."
  },

  "roller-blading": {
    name: "Roller Blading",
    category: "blade-sports",
    baseAttributes: ["balance", "edge-control", "gliding", "speed-control"],
    difficulty: "easy",
    targetHours: 30,
    accessibility: {
      equipmentCost: 80,
      equipmentType: "purchase",
      location: "any-pavement",
      season: "year-round",
      availability: "immediate",
      venuesNearArnhem: ["Any bike path", "Sonsbeek Park"]
    },
    transfersTo: {
      "ice-skating": 80,
      skateboarding: 50
    },
    boostedBy: {
      "ice-skating": 80,
      skateboarding: 50
    },
    description: "Year-round alternative to ice skating. Great for outdoor fitness."
  },

  // ==================== SKI SPORTS ====================
  skiing: {
    name: "Skiing",
    category: "ski-sports",
    baseAttributes: ["balance", "edge-control", "independent-legs", "parallel-coordination"],
    difficulty: "medium",
    targetHours: 40,
    accessibility: {
      equipmentCost: 50,
      equipmentType: "rental",
      location: "snow-mountain",
      season: "winter-or-indoor",
      availability: "local-venue",
      venuesNearArnhem: ["SnowWorld Landgraaf", "SnowWorld Zoetermeer"]
    },
    transfersTo: {
      snowboarding: 70,
      "ice-skating": 40
    },
    boostedBy: {
      "ice-skating": 40,
      snowboarding: 70
    },
    description: "Two-plank alternative to snowboarding. Easier to start, harder to master."
  },

  // ==================== DRIVING CLUSTER ====================
  "car-driving": {
    name: "Car Driving",
    category: "driving",
    baseAttributes: ["vehicle-control", "spatial-awareness", "reaction-time", "traffic-rules"],
    difficulty: "easy",
    targetHours: 40, // Until license
    accessibility: {
      equipmentCost: 0, // Included in lessons
      equipmentType: "none",
      location: "roads",
      season: "year-round",
      availability: "local-school",
      venuesNearArnhem: ["Multiple driving schools in Arnhem"]
    },
    transfersTo: {
      "motorbike-driving": 50,
      drifting: 60,
      racing: 65
    },
    description: "Essential life skill. Foundation for all motorized vehicles."
  },

  "motorbike-driving": {
    name: "Motorbike Driving",
    category: "driving",
    baseAttributes: ["vehicle-control", "balance", "reaction-time", "counter-steering"],
    difficulty: "medium",
    targetHours: 30,
    accessibility: {
      equipmentCost: 0,
      equipmentType: "none",
      location: "roads",
      season: "spring-fall",
      availability: "local-school",
      venuesNearArnhem: ["Motorcycle schools in Arnhem"]
    },
    transfersTo: {
      drifting: 40,
      racing: 50
    },
    boostedBy: {
      "car-driving": 50
    },
    requires: ["car-driving"], // Often need car license first in NL
    description: "Adds balance dimension to driving. More engaging than cars."
  },

  drifting: {
    name: "Drifting",
    category: "driving",
    baseAttributes: ["vehicle-control", "weight-transfer", "precision", "throttle-control"],
    difficulty: "hard",
    targetHours: 60,
    accessibility: {
      equipmentCost: 200, // Track day + instructor
      equipmentType: "rental",
      location: "race-track",
      season: "year-round",
      availability: "specialty-venue",
      venuesNearArnhem: ["Circuit Park Zandvoort (1.5hrs)", "TT Circuit Assen (2hrs)"]
    },
    transfersTo: {
      racing: 70
    },
    boostedBy: {
      "car-driving": 60,
      "motorbike-driving": 40
    },
    requires: ["car-driving"],
    description: "Advanced car control. Controlled oversteer and weight transfer."
  },

  racing: {
    name: "Racing",
    category: "driving",
    baseAttributes: ["vehicle-control", "precision", "racing-line", "competition"],
    difficulty: "hard",
    targetHours: 80,
    accessibility: {
      equipmentCost: 300, // Track day + rental
      equipmentType: "rental",
      location: "race-track",
      season: "year-round",
      availability: "specialty-venue",
      venuesNearArnhem: ["Circuit Park Zandvoort", "TT Circuit Assen"]
    },
    boostedBy: {
      "car-driving": 65,
      drifting: 70
    },
    requires: ["car-driving"],
    description: "Competitive driving. Optimal racing lines and speed management."
  },

  // ==================== CLIMBING CLUSTER ====================
  "rock-climbing": {
    name: "Rock Climbing",
    category: "climbing",
    baseAttributes: ["grip-strength", "problem-solving", "body-awareness", "endurance"],
    difficulty: "medium",
    targetHours: 40,
    accessibility: {
      equipmentCost: 15, // Rental per session
      equipmentType: "rental",
      location: "climbing-gym",
      season: "year-round",
      availability: "local-venue",
      venuesNearArnhem: ["Monk Bouldergym Arnhem", "Energiehaven Nijmegen (20min)"]
    },
    transfersTo: {
      bouldering: 90
    },
    description: "Rope climbing. Problem-solving with vertical movement."
  },

  bouldering: {
    name: "Bouldering",
    category: "climbing",
    baseAttributes: ["grip-strength", "problem-solving", "dynamic-movement", "power"],
    difficulty: "medium",
    targetHours: 40,
    accessibility: {
      equipmentCost: 10, // Just shoes rental
      equipmentType: "rental",
      location: "climbing-gym",
      season: "year-round",
      availability: "local-venue",
      venuesNearArnhem: ["Monk Bouldergym Arnhem", "Energiehaven Nijmegen"]
    },
    transfersTo: {
      "rock-climbing": 90
    },
    boostedBy: {
      "rock-climbing": 90
    },
    description: "Shorter climbs without ropes. More dynamic and powerful."
  },

  // ==================== DANCE ====================
  "ballroom-dancing": {
    name: "Ballroom Dancing",
    category: "dance",
    baseAttributes: ["rhythm", "balance", "partner-coordination", "timing"],
    difficulty: "medium",
    targetHours: 50,
    accessibility: {
      equipmentCost: 0,
      equipmentType: "none",
      location: "dance-studio",
      season: "year-round",
      availability: "local-school",
      venuesNearArnhem: ["Danscentrum Arnhem", "Dansschool Arnhem"]
    },
    transfersTo: {
      // Helps with general balance but not sport-specific
    },
    description: "Partner dancing. Rhythm, timing, and social coordination."
  },

  // ==================== EXTREME SPORTS ====================
  skydiving: {
    name: "Skydiving",
    category: "extreme",
    baseAttributes: ["fear-management", "body-control", "commitment", "mental-strength"],
    difficulty: "easy-but-scary",
    targetHours: 10, // Just to get comfortable with tandem
    accessibility: {
      equipmentCost: 200, // Per tandem jump
      equipmentType: "none",
      location: "drop-zone",
      season: "spring-fall",
      availability: "regional",
      venuesNearArnhem: ["Paracentrum Teuge (30min)", "Skydive Rotterdam (1.5hrs)"]
    },
    transfersTo: {
      // More mental than physical transfer
    },
    description: "Conquering fear. Mental challenge more than physical."
  },

  // ==================== ANIMAL SPORTS ====================
  "horse-riding": {
    name: "Horse Riding",
    category: "animal-sports",
    baseAttributes: ["balance", "animal-communication", "core-strength", "patience"],
    difficulty: "medium",
    targetHours: 50,
    accessibility: {
      equipmentCost: 30, // Per lesson
      equipmentType: "none",
      location: "stable",
      season: "year-round",
      availability: "local-school",
      venuesNearArnhem: ["Multiple horse stables near Arnhem", "Manege Warnsborn"]
    },
    transfersTo: {
      // Unique skill, minimal transfer
    },
    description: "Animal partnership. Balance and communication with horses."
  }
};

module.exports = { SKILL_DATABASE };
