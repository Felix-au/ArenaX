// ===================================
// ArenaX Data Structures
// All hardcoded JSON data for the MVP
// ===================================

// Problems Data
const problems = [
  {
    icon: "💰",
    title: "High upfront costs deter new users",
    description: "Traditional memberships require large commitments, making it difficult for new players to explore different sports without significant financial investment."
  },
  {
    icon: "🎯",
    title: "Limited trial options prevent exploration",
    description: "Without accessible trial sessions, beginners hesitate to try new sports, limiting their ability to discover activities they might enjoy."
  },
  {
    icon: "📍",
    title: "Arenas lack discoverability and customer engagement",
    description: "Sports facilities struggle to reach potential customers and maintain consistent bookings, leading to underutilized resources and lost revenue."
  },
  {
    icon: "🎾",
    title: "Equipment access is a barrier for beginners",
    description: "The need to purchase expensive equipment upfront prevents many people from trying new sports, creating an unnecessary barrier to entry."
  },
  {
    icon: "📱",
    title: "Fragmented booking and payment systems",
    description: "Players must navigate multiple platforms and payment methods to book different facilities, creating friction and reducing engagement."
  },
  {
    icon: "⏰",
    title: "Inflexible scheduling and peak hour pricing",
    description: "Fixed time slots and surge pricing during peak hours make it difficult for working professionals to access facilities at convenient times."
  }
];

// Market Opportunity Data
const marketOpportunity = {
  marketSize: 100,
  marketSizeDisplay: "$100B+",
  marketSubtitle: "Global Sports Facility Market",
  points: [
    {
      icon: "📈",
      title: "Growing Health Consciousness",
      description: "Rising awareness of fitness and wellness drives demand for accessible sports facilities across all age groups."
    },
    {
      icon: "🏙️",
      title: "Urban Population Growth",
      description: "Increasing urbanization creates concentrated demand for multi-sport facilities in metropolitan areas."
    },
    {
      icon: "💳",
      title: "Subscription Economy Boom",
      description: "Consumers increasingly prefer flexible subscription models over traditional pay-per-use or long-term commitments."
    },
    {
      icon: "🎯",
      title: "Underutilized Arena Capacity",
      description: "Sports facilities operate at 40-60% capacity, presenting significant opportunity for optimization and revenue growth."
    },
    {
      icon: "🌐",
      title: "Digital Transformation",
      description: "Technology adoption in sports booking and community building creates new engagement and monetization opportunities."
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Wellness Trend",
      description: "Families seeking shared activities and quality time together drive demand for multi-generational sports facilities."
    }
  ]
};

// Solution Flow Data
const solutionFlow = [
  {
    step: 1,
    name: "Discovery",
    description: "Find arenas locally by city and sport",
    icon: "🔍"
  },
  {
    step: 2,
    name: "Booking",
    description: "Reserve slots with flexible timing",
    icon: "📅"
  },
  {
    step: 3,
    name: "Play",
    description: "Access facilities with equipment",
    icon: "🏃"
  },
  {
    step: 4,
    name: "Connect",
    description: "Build local sports community",
    icon: "👥"
  },
  {
    step: 5,
    name: "Reward",
    description: "Earn discounts and benefits",
    icon: "🎁"
  }
];

// Cities Data
const cities = [
  "Bangalore",
  "Delhi",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad"
];

// Sports Data
const sports = [
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "tennis", name: "Tennis", icon: "🎾" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "swimming", name: "Swimming", icon: "🏊" },
  { id: "squash", name: "Squash", icon: "🎯" },
  { id: "table_tennis", name: "Table Tennis", icon: "🏓" }
];

// Arenas Data
const arenas = [
  {
    id: "arena_001",
    name: "SportZone Indiranagar",
    city: "Bangalore",
    location: "100 Feet Road, Indiranagar",
    sports: ["badminton", "tennis", "squash"],
    rating: 4.5,
    pricePerHour: 800,
    facilities: ["parking", "lockers", "equipment_rental", "cafeteria", "first_aid"],
    availableSlots: ["06:00-08:00", "08:00-10:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_002",
    name: "PlayHub Koramangala",
    city: "Bangalore",
    location: "5th Block, Koramangala",
    sports: ["cricket", "football", "basketball"],
    rating: 4.7,
    pricePerHour: 1200,
    facilities: ["parking", "lockers", "equipment_rental", "changing_rooms"],
    availableSlots: ["06:00-08:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_003",
    name: "Arena Plus Whitefield",
    city: "Bangalore",
    location: "ITPL Main Road, Whitefield",
    sports: ["swimming", "badminton", "table_tennis"],
    rating: 4.3,
    pricePerHour: 900,
    facilities: ["parking", "lockers", "changing_rooms", "cafeteria"],
    availableSlots: ["07:00-09:00", "17:00-19:00", "19:00-21:00"],
    trialAvailable: false
  },
  {
    id: "arena_004",
    name: "Metro Sports Complex",
    city: "Delhi",
    location: "Connaught Place, Central Delhi",
    sports: ["cricket", "football", "tennis", "basketball"],
    rating: 4.6,
    pricePerHour: 1500,
    facilities: ["parking", "lockers", "equipment_rental", "cafeteria", "first_aid", "changing_rooms"],
    availableSlots: ["06:00-08:00", "08:00-10:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_005",
    name: "Capital Fitness Arena",
    city: "Delhi",
    location: "Saket, South Delhi",
    sports: ["badminton", "squash", "table_tennis", "swimming"],
    rating: 4.4,
    pricePerHour: 1000,
    facilities: ["parking", "lockers", "equipment_rental", "changing_rooms"],
    availableSlots: ["07:00-09:00", "17:00-19:00", "19:00-21:00"],
    trialAvailable: true
  },
  {
    id: "arena_006",
    name: "PlayHub Bandra",
    city: "Mumbai",
    location: "Linking Road, Bandra West",
    sports: ["tennis", "badminton", "squash"],
    rating: 4.8,
    pricePerHour: 1400,
    facilities: ["parking", "lockers", "equipment_rental", "cafeteria", "first_aid"],
    availableSlots: ["06:00-08:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_007",
    name: "Marine Drive Sports Club",
    city: "Mumbai",
    location: "Marine Drive, South Mumbai",
    sports: ["cricket", "football", "basketball", "swimming"],
    rating: 4.5,
    pricePerHour: 1600,
    facilities: ["parking", "lockers", "changing_rooms", "cafeteria"],
    availableSlots: ["06:00-08:00", "16:00-18:00", "18:00-20:00"],
    trialAvailable: false
  },
  {
    id: "arena_008",
    name: "Andheri Sports Arena",
    city: "Mumbai",
    location: "Andheri East",
    sports: ["badminton", "table_tennis", "basketball"],
    rating: 4.2,
    pricePerHour: 900,
    facilities: ["parking", "lockers", "equipment_rental"],
    availableSlots: ["07:00-09:00", "17:00-19:00", "19:00-21:00", "21:00-23:00"],
    trialAvailable: true
  },
  {
    id: "arena_009",
    name: "Arena Plus Gachibowli",
    city: "Hyderabad",
    location: "Gachibowli, Financial District",
    sports: ["cricket", "football", "tennis", "badminton"],
    rating: 4.6,
    pricePerHour: 1100,
    facilities: ["parking", "lockers", "equipment_rental", "cafeteria", "first_aid"],
    availableSlots: ["06:00-08:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_010",
    name: "Hitech City Sports Hub",
    city: "Hyderabad",
    location: "Hitech City, Madhapur",
    sports: ["badminton", "squash", "table_tennis", "swimming"],
    rating: 4.4,
    pricePerHour: 950,
    facilities: ["parking", "lockers", "changing_rooms", "cafeteria"],
    availableSlots: ["07:00-09:00", "17:00-19:00", "19:00-21:00"],
    trialAvailable: true
  },
  {
    id: "arena_011",
    name: "Koregaon Park Arena",
    city: "Pune",
    location: "Koregaon Park",
    sports: ["tennis", "badminton", "squash", "swimming"],
    rating: 4.5,
    pricePerHour: 1000,
    facilities: ["parking", "lockers", "equipment_rental", "cafeteria"],
    availableSlots: ["06:00-08:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_012",
    name: "Hinjewadi Sports Complex",
    city: "Pune",
    location: "Hinjewadi Phase 1",
    sports: ["cricket", "football", "basketball"],
    rating: 4.3,
    pricePerHour: 1100,
    facilities: ["parking", "lockers", "equipment_rental", "changing_rooms"],
    availableSlots: ["06:00-08:00", "16:00-18:00", "18:00-20:00"],
    trialAvailable: false
  },
  {
    id: "arena_013",
    name: "T Nagar Sports Arena",
    city: "Chennai",
    location: "T Nagar, Central Chennai",
    sports: ["cricket", "badminton", "tennis", "table_tennis"],
    rating: 4.4,
    pricePerHour: 900,
    facilities: ["parking", "lockers", "equipment_rental", "first_aid"],
    availableSlots: ["06:00-08:00", "17:00-19:00", "19:00-21:00"],
    trialAvailable: true
  },
  {
    id: "arena_014",
    name: "OMR Sports Hub",
    city: "Chennai",
    location: "Old Mahabalipuram Road",
    sports: ["football", "basketball", "swimming", "squash"],
    rating: 4.6,
    pricePerHour: 1050,
    facilities: ["parking", "lockers", "changing_rooms", "cafeteria"],
    availableSlots: ["07:00-09:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_015",
    name: "Salt Lake Sports Complex",
    city: "Kolkata",
    location: "Salt Lake, Sector V",
    sports: ["cricket", "football", "badminton", "tennis"],
    rating: 4.5,
    pricePerHour: 850,
    facilities: ["parking", "lockers", "equipment_rental", "cafeteria"],
    availableSlots: ["06:00-08:00", "16:00-18:00", "18:00-20:00"],
    trialAvailable: true
  },
  {
    id: "arena_016",
    name: "Park Street Arena",
    city: "Kolkata",
    location: "Park Street, Central Kolkata",
    sports: ["badminton", "squash", "table_tennis", "swimming"],
    rating: 4.3,
    pricePerHour: 800,
    facilities: ["parking", "lockers", "changing_rooms"],
    availableSlots: ["07:00-09:00", "17:00-19:00", "19:00-21:00"],
    trialAvailable: false
  },
  {
    id: "arena_017",
    name: "Satellite Sports Zone",
    city: "Ahmedabad",
    location: "Satellite Road",
    sports: ["cricket", "football", "basketball", "tennis"],
    rating: 4.4,
    pricePerHour: 900,
    facilities: ["parking", "lockers", "equipment_rental", "cafeteria", "first_aid"],
    availableSlots: ["06:00-08:00", "18:00-20:00", "20:00-22:00"],
    trialAvailable: true
  },
  {
    id: "arena_018",
    name: "SG Highway Sports Hub",
    city: "Ahmedabad",
    location: "SG Highway, Bodakdev",
    sports: ["badminton", "squash", "table_tennis", "swimming"],
    rating: 4.5,
    pricePerHour: 950,
    facilities: ["parking", "lockers", "equipment_rental", "changing_rooms", "cafeteria"],
    availableSlots: ["07:00-09:00", "17:00-19:00", "19:00-21:00"],
    trialAvailable: true
  }
];

// Subscription Plans Data
const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 999,
    currency: "INR",
    period: "month",
    bookingLimit: 4,
    benefits: [
      "4 bookings per month",
      "Access to all sports",
      "10% discount on bookings",
      "Community access"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: 1999,
    currency: "INR",
    period: "month",
    bookingLimit: 12,
    benefits: [
      "12 bookings per month",
      "Access to all sports",
      "20% discount on bookings",
      "Free equipment rental",
      "Priority booking",
      "Community access"
    ],
    popular: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 3999,
    currency: "INR",
    period: "month",
    bookingLimit: -1,
    benefits: [
      "Unlimited bookings",
      "Access to all sports",
      "30% discount on bookings",
      "Free equipment rental",
      "Priority booking",
      "Personal trainer sessions",
      "Tournament entry included",
      "Community access"
    ],
    popular: false
  },
  {
    id: "family",
    name: "Family",
    price: 4999,
    currency: "INR",
    period: "month",
    bookingLimit: -1,
    benefits: [
      "Unlimited bookings for 4 members",
      "Access to all sports",
      "25% discount on bookings",
      "Free equipment rental",
      "Priority booking",
      "Community access"
    ],
    popular: false
  }
];

// Community Posts Data (Sample)
const samplePosts = [
  {
    id: "post_001",
    userId: "user_101",
    userName: "Rahul Sharma",
    userCity: "Bangalore",
    sport: "badminton",
    content: "Looking for 2 players for badminton doubles this Saturday at SportZone Indiranagar. 6-8 PM. Intermediate level preferred!",
    timestamp: Date.now() - 3600000, // 1 hour ago
    likes: 8,
    comments: 3
  },
  {
    id: "post_002",
    userId: "user_102",
    userName: "Priya Patel",
    userCity: "Mumbai",
    sport: "tennis",
    content: "Anyone up for tennis practice at PlayHub Bandra tomorrow morning? 7 AM. All skill levels welcome!",
    timestamp: Date.now() - 7200000, // 2 hours ago
    likes: 12,
    comments: 5
  },
  {
    id: "post_003",
    userId: "user_103",
    userName: "Arjun Reddy",
    userCity: "Hyderabad",
    sport: "football",
    content: "Need 3 more players for 5-a-side football this evening at Arena Plus Gachibowli! 6 PM kickoff. Let's play!",
    timestamp: Date.now() - 10800000, // 3 hours ago
    likes: 15,
    comments: 7
  },
  {
    id: "post_004",
    userId: "user_104",
    userName: "Sneha Iyer",
    userCity: "Chennai",
    sport: "swimming",
    content: "Starting a morning swimming group at OMR Sports Hub. Monday, Wednesday, Friday 6-7 AM. Join us for fitness and fun!",
    timestamp: Date.now() - 21600000, // 6 hours ago
    likes: 20,
    comments: 9
  },
  {
    id: "post_005",
    userId: "user_105",
    userName: "Vikram Singh",
    userCity: "Delhi",
    sport: "cricket",
    content: "Weekend cricket match at Metro Sports Complex! Looking for 6 more players. Sunday 8 AM. Bring your A-game!",
    timestamp: Date.now() - 43200000, // 12 hours ago
    likes: 25,
    comments: 11
  },
  {
    id: "post_006",
    userId: "user_106",
    userName: "Anjali Desai",
    userCity: "Pune",
    sport: "squash",
    content: "Beginner-friendly squash session at Koregaon Park Arena. Thursday evening 7 PM. Equipment provided. Come try it out!",
    timestamp: Date.now() - 86400000, // 1 day ago
    likes: 10,
    comments: 4
  },
  {
    id: "post_007",
    userId: "user_107",
    userName: "Karthik Menon",
    userCity: "Bangalore",
    sport: "basketball",
    content: "3v3 basketball tournament at PlayHub Koramangala next Saturday! Register your team. Prize for winners!",
    timestamp: Date.now() - 172800000, // 2 days ago
    likes: 30,
    comments: 15
  },
  {
    id: "post_008",
    userId: "user_108",
    userName: "Meera Kapoor",
    userCity: "Mumbai",
    sport: "table_tennis",
    content: "Table tennis coaching sessions starting at Andheri Sports Arena. Tuesdays and Thursdays 5-6 PM. All ages welcome!",
    timestamp: Date.now() - 259200000, // 3 days ago
    likes: 18,
    comments: 6
  },
  {
    id: "post_009",
    userId: "user_109",
    userName: "Aditya Gupta",
    userCity: "Kolkata",
    sport: "badminton",
    content: "Advanced badminton players wanted for practice sessions at Salt Lake Sports Complex. Weekday mornings 6-8 AM.",
    timestamp: Date.now() - 345600000, // 4 days ago
    likes: 14,
    comments: 8
  },
  {
    id: "post_010",
    userId: "user_110",
    userName: "Divya Shah",
    userCity: "Ahmedabad",
    sport: "tennis",
    content: "Ladies tennis group forming at Satellite Sports Zone! Sunday mornings 8-10 AM. Beginners and intermediates welcome. Let's play!",
    timestamp: Date.now() - 432000000, // 5 days ago
    likes: 22,
    comments: 10
  }
];

// Rewards Data
const rewards = [
  {
    id: "reward_001",
    name: "₹200 Booking Discount",
    pointsCost: 100,
    description: "Get ₹200 off on your next booking",
    icon: "💰"
  },
  {
    id: "reward_002",
    name: "Free Equipment Rental",
    pointsCost: 150,
    description: "One free equipment rental session",
    icon: "🎾"
  },
  {
    id: "reward_003",
    name: "Tournament Entry Pass",
    pointsCost: 300,
    description: "Free entry to any ArenaX tournament",
    icon: "🏆"
  },
  {
    id: "reward_004",
    name: "₹500 Booking Voucher",
    pointsCost: 250,
    description: "Get ₹500 off on your next booking",
    icon: "🎫"
  },
  {
    id: "reward_005",
    name: "Personal Training Session",
    pointsCost: 400,
    description: "One free personal training session",
    icon: "💪"
  },
  {
    id: "reward_006",
    name: "Sports Gear Discount",
    pointsCost: 200,
    description: "20% off on sports equipment purchase",
    icon: "🎽"
  },
  {
    id: "reward_007",
    name: "Guest Pass",
    pointsCost: 180,
    description: "Bring a friend for free to any session",
    icon: "👥"
  },
  {
    id: "reward_008",
    name: "Premium Court Access",
    pointsCost: 350,
    description: "One-time access to premium courts",
    icon: "⭐"
  }
];

// Achievements Data
const achievements = [
  {
    id: "first_booking",
    name: "First Step",
    description: "Made your first booking",
    icon: "🎯",
    points: 50
  },
  {
    id: "5_sports_tried",
    name: "Multi-Sport Enthusiast",
    description: "Tried 5 different sports",
    icon: "🏆",
    points: 100
  },
  {
    id: "community_builder",
    name: "Community Builder",
    description: "Created 10 community posts",
    icon: "👥",
    points: 75
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Booked 5 morning slots (before 8 AM)",
    icon: "🌅",
    points: 60
  },
  {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    description: "Completed 10 weekend bookings",
    icon: "⚡",
    points: 80
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Connected with 20 players",
    icon: "🦋",
    points: 90
  },
  {
    id: "loyal_member",
    name: "Loyal Member",
    description: "Active member for 6 months",
    icon: "💎",
    points: 200
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "Booked sessions for 7 consecutive days",
    icon: "🔥",
    points: 120
  }
];

// Tier System Data
const tiers = [
  {
    name: "Bronze",
    minPoints: 0,
    color: "#CD7F32",
    benefits: ["Basic rewards access", "Community features"]
  },
  {
    name: "Silver",
    minPoints: 200,
    color: "#C0C0C0",
    benefits: ["5% extra discount", "Priority support", "Exclusive rewards"]
  },
  {
    name: "Gold",
    minPoints: 500,
    color: "#FFD700",
    benefits: ["10% extra discount", "Early tournament access", "Premium rewards"]
  },
  {
    name: "Platinum",
    minPoints: 1000,
    color: "#E5E4E2",
    benefits: ["15% extra discount", "VIP events access", "All rewards unlocked", "Personal concierge"]
  }
];

// Revenue Streams Data
const revenueStreams = [
  {
    id: "revenue_001",
    title: "Subscription Plans",
    description: "Individual and family packages with flexible pricing tiers",
    icon: "💳"
  },
  {
    id: "revenue_002",
    title: "One-time Bookings",
    description: "Pay-per-use flexibility for casual players",
    icon: "🎫"
  },
  {
    id: "revenue_003",
    title: "Commission on Bookings",
    description: "Revenue share model with partner arenas",
    icon: "💰"
  },
  {
    id: "revenue_004",
    title: "Equipment Rentals",
    description: "Premium gear rental fees and partnerships",
    icon: "🎽"
  },
  {
    id: "revenue_005",
    title: "Events & Tournaments",
    description: "Hosting fees and participation charges",
    icon: "🏆"
  },
  {
    id: "revenue_006",
    title: "Advertising & Sponsorships",
    description: "Brand partnerships and targeted advertising",
    icon: "📢"
  }
];

// Scalability Data
const scalability = {
  expansion: [
    "Expand to tier-2 and tier-3 cities across India",
    "International expansion to Southeast Asian markets",
    "Add new sports categories (yoga, martial arts, dance)",
    "Corporate wellness programs and bulk subscriptions"
  ],
  partnerships: [
    "Partner with schools and colleges for student programs",
    "Collaborate with sports equipment brands",
    "Tie-ups with fitness influencers and coaches",
    "Corporate partnerships for employee wellness"
  ]
};

// Competitive Advantages Data
const advantages = [
  {
    id: "advantage_001",
    title: "Multi-Sport Access",
    description: "Flexible subscription plans across all sports, eliminating the need for multiple memberships",
    icon: "🎯"
  },
  {
    id: "advantage_002",
    title: "Equipment During Trials",
    description: "Free equipment rental for trial sessions, lowering barriers for beginners",
    icon: "🎾"
  },
  {
    id: "advantage_003",
    title: "Enhanced Arena Visibility",
    description: "Digital platform increases booking rates and revenue for partner arenas",
    icon: "📈"
  },
  {
    id: "advantage_004",
    title: "Community & Gamification",
    description: "Built-in social features, tournaments, and rewards drive engagement and retention",
    icon: "👥"
  },
  {
    id: "advantage_005",
    title: "Scalable Tech Ecosystem",
    description: "Digital-first platform enables rapid expansion and seamless user experience",
    icon: "🚀"
  },
  {
    id: "advantage_006",
    title: "Data-Driven Insights",
    description: "Analytics and personalized recommendations help users discover new sports and optimize their fitness journey",
    icon: "📊"
  }
];

// Team Members Data
const teamMembers = [
  {
    id: "team_001",
    name: "Sampurn Gupta",
    role: "Team Leader",
    image: "placeholder.jpg",
    bio: "Visionary leader driving ArenaX's mission to democratize sports access"
  },
  {
    id: "team_002",
    name: "Harshit Soni",
    role: "Lead Developer",
    image: "placeholder.jpg",
    bio: "Technical architect building scalable solutions for sports enthusiasts"
  },
  {
    id: "team_003",
    name: "Aniket Mishra",
    role: "[Role TBD]",
    image: "placeholder.jpg",
    bio: "Contributing to ArenaX's growth and success"
  },
  {
    id: "team_004",
    name: "Punya Mahajan",
    role: "[Role TBD]",
    image: "placeholder.jpg",
    bio: "Contributing to ArenaX's growth and success"
  },
  {
    id: "team_005",
    name: "Raghav Bhargava",
    role: "[Role TBD]",
    image: "placeholder.jpg",
    bio: "Contributing to ArenaX's growth and success"
  }
];

// Default User Profile
const defaultUserProfile = {
  id: "user_001",
  name: "Guest User",
  email: "",
  city: "Bangalore",
  favoriteSports: [],
  skillLevel: "intermediate",
  preferredTimeSlots: ["evening"],
  budgetRange: "500-1000",
  selectedPlan: null,
  joinedDate: Date.now()
};

// Default Rewards
const defaultRewards = {
  userId: "user_001",
  points: 0,
  tier: "Bronze",
  achievements: [],
  redeemedRewards: []
};
