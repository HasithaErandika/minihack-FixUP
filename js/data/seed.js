window.FixUP = window.FixUP || {};

window.FixUP.seed = function () {
  const now = Date.now();
  const hrsAgo = (h) => now - h * 3600 * 1000;
  const daysAgo = (d) => now - d * 24 * 3600 * 1000;

  return {
    role: "consumer", // consumer | technician | seller (swapped by the role switcher)
    onboarded: false,

    users: {
      consumer: {
        id: "u-consumer",
        role: "consumer",
        name: "Ishara Perera",
        initials: "IP",
        location: "Nugegoda, Colombo",
        joinedDate: daysAgo(146),
        impact: {
          points: 1240,
          streakDays: 6,
          ewasteKg: 61.4,
          co2Kg: 512,
          treesEquivalent: 24.4,
          moneySaved: 38400,
          badges: ["first-fix", "streak-5", "eco-starter"]
        },
        savedTechnicianIds: ["t-2", "t-4"],
        savedListingIds: ["l-3"]
      },
      technician: {
        id: "u-tech",
        role: "technician",
        name: "Dinesh Fernando",
        initials: "DF",
        location: "Dehiwala, Colombo",
        joinedDate: daysAgo(210),
        verification: { idVerified: true, skillAssessed: true, referenceChecked: true, vtaCertified: true },
        categories: ["Electronics", "Appliances"],
        rating: 4.8,
        reviewCount: 132,
        bio: "Electronics & appliance repair specialist, 9 years experience. VTA-certified in electrical maintenance. I fix it right the first time, or I don't charge for the visit.",
        portfolio: [
          { title: "Fridge compressor swap", tag: "Appliances" },
          { title: "Laptop motherboard reflow", tag: "Electronics" },
          { title: "Washing machine motor rewind", tag: "Appliances" }
        ],
        subscription: { status: "trial", freeJobsRemaining: 2, freeJobsTotal: 5, plan: null },
        earnings: { total: 184500, thisWeek: 12600, history: [
          { label: "Mon", amount: 1800 }, { label: "Tue", amount: 2400 }, { label: "Wed", amount: 900 },
          { label: "Thu", amount: 3200 }, { label: "Fri", amount: 1600 }, { label: "Sat", amount: 2700 }, { label: "Sun", amount: 0 }
        ]},
        impact: {
          points: 3420,
          streakDays: 11,
          ewasteKg: 218,
          co2Kg: 1840,
          treesEquivalent: 87.6,
          moneySaved: null,
          badges: ["first-fix", "streak-5", "streak-10", "parts-saver", "fifty-fixes"]
        }
      },
      seller: {
        id: "u-seller",
        role: "seller",
        name: "Rasika Silva",
        initials: "RS",
        businessName: "Colombo Spares Hub",
        location: "Pettah, Colombo",
        joinedDate: daysAgo(300),
        rating: 4.6,
        reviewCount: 58,
        salesSummary: { totalRevenue: 612000, thisMonth: 84500, ordersFulfilled: 214, growthPct: 12, avgOrderValue: 3950, buyerSplit: { technician: 68, consumer: 32 }, categorySplit: [{ label: "Appliances", pct: 46 }, { label: "Electronics", pct: 39 }, { label: "Other", pct: 15 }] },
        subscription: { status: "active", plan: "Growth", price: 3500 }
      }
    },

    technicians: [
      { id: "t-1", name: "Dinesh Fernando", initials: "DF", verified: true, categories: ["Electronics", "Appliances"], rating: 4.8, reviewCount: 132, distanceKm: 1.4, priceFrom: 1500, levelName: "Fix Master", location: "Dehiwala" },
      { id: "t-2", name: "Nimal Wickrama", initials: "NW", verified: true, categories: ["Appliances"], rating: 4.9, reviewCount: 201, distanceKm: 2.1, priceFrom: 2000, levelName: "Circular Champion", location: "Nugegoda" },
      { id: "t-3", name: "Kasun Bandara", initials: "KB", verified: true, categories: ["Electronics"], rating: 4.6, reviewCount: 74, distanceKm: 3.0, priceFrom: 1200, levelName: "Repair Regular", location: "Maharagama" },
      { id: "t-4", name: "Sanduni Rathnayake", initials: "SR", verified: true, categories: ["Garments"], rating: 4.7, reviewCount: 96, distanceKm: 1.8, priceFrom: 800, levelName: "Fix Master", location: "Nugegoda" },
      { id: "t-5", name: "Ruwan Jayasuriya", initials: "RJ", verified: true, categories: ["Vehicles"], rating: 4.5, reviewCount: 63, distanceKm: 4.2, priceFrom: 2500, levelName: "Repair Rookie", location: "Kottawa" }
    ],

    jobs: [
      {
        id: "j-1",
        consumerId: "u-consumer",
        technicianId: "t-1",
        category: "fridge",
        title: "Refrigerator not cooling",
        description: "Fridge stopped cooling properly two days ago, makes a humming noise. LG double-door, ~6 years old.",
        location: "Nugegoda, Colombo",
        status: "in-progress",
        quote: { amount: 6500, breakdown: [{ label: "Diagnostic visit", amount: 500 }, { label: "Compressor relay", amount: 3500 }, { label: "Labour", amount: 2500 }] },
        createdAt: hrsAgo(20),
        timeline: [
          { stage: "requested", at: hrsAgo(20) },
          { stage: "matched", at: hrsAgo(19) },
          { stage: "confirmed", at: hrsAgo(18) },
          { stage: "in-progress", at: hrsAgo(3) }
        ],
        partsUsed: [{ name: "Compressor start relay", sourcedFrom: "Colombo Spares Hub" }]
      },
      {
        id: "j-2",
        consumerId: "u-consumer",
        technicianId: "t-3",
        category: "phone",
        title: "Phone screen cracked",
        description: "Samsung A54 screen shattered after a drop, touch still partially works.",
        location: "Nugegoda, Colombo",
        status: "completed",
        quote: { amount: 8500, breakdown: [{ label: "Screen assembly", amount: 7000 }, { label: "Labour", amount: 1500 }] },
        createdAt: daysAgo(9),
        timeline: [
          { stage: "requested", at: daysAgo(9) },
          { stage: "matched", at: daysAgo(9) },
          { stage: "confirmed", at: daysAgo(8) },
          { stage: "in-progress", at: daysAgo(8) },
          { stage: "completed", at: daysAgo(7) }
        ],
        rating: { stars: 5, tags: ["On time", "Fair price"], comment: "Quick and clean fix, looks brand new." }
      },
      {
        id: "j-3",
        consumerId: "u-consumer",
        technicianId: "t-4",
        category: "garment",
        title: "Jacket zipper replacement",
        description: "Leather jacket main zipper broke, needs a full replacement.",
        location: "Nugegoda, Colombo",
        status: "requested",
        createdAt: hrsAgo(2),
        timeline: [{ stage: "requested", at: hrsAgo(2) }]
      }
    ],

    // Jobs visible in the technician's instant-accept feed (not yet accepted)
    jobFeed: [
      { id: "jf-1", category: "laptop", title: "Laptop won't turn on", budget: "3,000 - 5,000", location: "Dehiwala", distanceKm: 0.8, postedHrsAgo: 1 },
      { id: "jf-2", category: "washer", title: "Washing machine leaking water", budget: "4,500 - 7,000", location: "Wellawatte", distanceKm: 2.6, postedHrsAgo: 3 },
      { id: "jf-3", category: "tv", title: "TV screen has lines/flicker", budget: "3,500 - 6,000", location: "Mount Lavinia", distanceKm: 3.4, postedHrsAgo: 5 },
      { id: "jf-4", category: "fridge", title: "Fridge door seal not sealing", budget: "1,500 - 2,500", location: "Dehiwala", distanceKm: 1.1, postedHrsAgo: 8 }
    ],

    listings: [
      { id: "l-1", sellerId: "u-seller", sellerName: "Colombo Spares Hub", sellerRating: 4.6, title: "Compressor start relay (universal)", category: "Appliances", condition: "New", price: 1200, stock: 34, pointsDiscountable: true },
      { id: "l-2", sellerId: "u-seller", sellerName: "Colombo Spares Hub", sellerRating: 4.6, title: "LG fridge door gasket", category: "Appliances", condition: "New", price: 3400, stock: 12, pointsDiscountable: true },
      { id: "l-3", sellerId: "s-2", sellerName: "TechParts Lanka", sellerRating: 4.7, title: "Samsung A54 OLED screen assembly", category: "Electronics", condition: "New", price: 7200, stock: 8, pointsDiscountable: true },
      { id: "l-4", sellerId: "s-2", sellerName: "TechParts Lanka", sellerRating: 4.7, title: "Laptop motherboard (refurbished, i5 8th gen)", category: "Electronics", condition: "Refurbished", price: 9500, stock: 3, pointsDiscountable: false },
      { id: "l-5", sellerId: "s-3", sellerName: "Kandy Salvage Co.", sellerRating: 4.3, title: "Washing machine drain pump", category: "Appliances", condition: "Salvaged", price: 1800, stock: 6, pointsDiscountable: true },
      { id: "l-6", sellerId: "u-seller", sellerName: "Colombo Spares Hub", sellerRating: 4.6, title: "Universal TV mainboard (assorted)", category: "Electronics", condition: "Used", price: 4200, stock: 5, pointsDiscountable: false }
    ],

    orders: [
      { id: "o-1", listingId: "l-1", listingTitle: "Compressor start relay (universal)", buyerName: "Dinesh Fernando", buyerType: "technician", quantity: 1, status: "fulfilled", pointsApplied: 0, createdAt: hrsAgo(21) },
      { id: "o-2", listingId: "l-2", listingTitle: "LG fridge door gasket", buyerName: "Nimal Wickrama", buyerType: "technician", quantity: 1, status: "pending", pointsApplied: 200, createdAt: hrsAgo(5) },
      { id: "o-3", listingId: "l-6", listingTitle: "Universal TV mainboard (assorted)", buyerName: "Kasun Bandara", buyerType: "technician", quantity: 2, status: "shipped", pointsApplied: 0, createdAt: daysAgo(2) },
      { id: "o-4", listingId: "l-1", listingTitle: "Compressor start relay (universal)", buyerName: "Amaya Gunasekara", buyerType: "consumer", quantity: 1, status: "pending", pointsApplied: 0, createdAt: hrsAgo(2) }
    ],

    conversations: [
      {
        id: "c-1",
        withName: "Dinesh Fernando",
        withInitials: "DF",
        jobId: "j-1",
        jobTitle: "Refrigerator not cooling",
        messages: [
          { from: "them", text: "Hi Ishara, I've checked the compressor. Need to replace the start relay, should be done today.", at: hrsAgo(4) },
          { from: "me", text: "Sounds good, thank you for the quick update!", at: hrsAgo(3.5) },
          { from: "them", text: "Part sourced from Colombo Spares Hub, fitting it now.", at: hrsAgo(3) }
        ]
      },
      {
        id: "c-2",
        withName: "Sanduni Rathnayake",
        withInitials: "SR",
        jobId: "j-3",
        jobTitle: "Jacket zipper replacement",
        messages: [
          { from: "them", text: "Got your request, can you share a photo of the zipper area?", at: hrsAgo(1.5) }
        ]
      }
    ],

    notifications: [
      { id: "n-1", type: "job", text: "Dinesh sent an update on your fridge repair", at: hrsAgo(3), read: false },
      { id: "n-2", type: "badge", text: "You unlocked the \"Eco Starter\" badge", at: daysAgo(1), read: false },
      { id: "n-3", type: "message", text: "New message from Sanduni Rathnayake", at: hrsAgo(1.5), read: false },
      { id: "n-4", type: "payment", text: "Payment of Rs. 8,500 confirmed for your phone repair", at: daysAgo(7), read: true },
      { id: "n-5", type: "system", text: "Welcome to FixUP. Complete your first repair to start earning impact points", at: daysAgo(146), read: true }
    ],

    badges: [
      { id: "first-fix", name: "First Fix", desc: "Completed your first verified repair", rarity: "Common" },
      { id: "streak-5", name: "5-Day Streak", desc: "Active on the platform 5 days in a row", rarity: "Common" },
      { id: "streak-10", name: "10-Day Streak", desc: "Active on the platform 10 days in a row", rarity: "Uncommon" },
      { id: "eco-starter", name: "Eco Starter", desc: "Avoided your first 25kg of e-waste", rarity: "Common" },
      { id: "parts-saver", name: "Parts Saver", desc: "Sourced 10 parts through the pooling network", rarity: "Uncommon" },
      { id: "fifty-fixes", name: "50 Fixes", desc: "Completed 50 verified repairs", rarity: "Rare" },
      { id: "circular-champion", name: "Circular Champion", desc: "Reached the top impact tier", rarity: "Rare" }
    ],

    leaderboard: {
      consumers: [
        { name: "Amaya Gunasekara", points: 4210 },
        { name: "Tharindu Silva", points: 3870 },
        { name: "Ishara Perera", points: 1240, isMe: true },
        { name: "Nadeesha Kumari", points: 980 },
        { name: "Chamod Perera", points: 760 }
      ],
      technicians: [
        { name: "Nimal Wickrama", jobs: 340, rating: 4.9 },
        { name: "Dinesh Fernando", jobs: 288, rating: 4.8, isMe: true },
        { name: "Kasun Bandara", jobs: 190, rating: 4.6 },
        { name: "Sanduni Rathnayake", jobs: 165, rating: 4.7 },
        { name: "Ruwan Jayasuriya", jobs: 98, rating: 4.5 }
      ]
    },

    categories: [
      { key: "phone", label: "Phones", group: "Electronics" },
      { key: "laptop", label: "Laptops", group: "Electronics" },
      { key: "tv", label: "TVs", group: "Electronics" },
      { key: "fridge", label: "Refrigerators", group: "Appliances" },
      { key: "washer", label: "Washing Machines", group: "Appliances" },
      { key: "garment", label: "Garments", group: "Garments" },
      { key: "vehicle", label: "Vehicles", group: "Vehicles" },
      { key: "other", label: "Other", group: "Other" }
    ]
  };
};
