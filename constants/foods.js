export const foods = {
  fruits: [
    {
      id: 'apple',
      name: 'Apple',
      category: 'fruits',
      nutrients: {
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fiber: 2.4,
        sugar: 10,
        vitamins: ['C', 'K'],
        minerals: ['Potassium']
      },
      benefits: [
        'Rich in antioxidants',
        'Good source of fiber',
        'Supports heart health'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'banana',
      name: 'Banana',
      category: 'fruits',
      nutrients: {
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fiber: 2.6,
        sugar: 12,
        vitamins: ['B6', 'C'],
        minerals: ['Potassium', 'Magnesium']
      },
      benefits: [
        'Easy to digest',
        'Great energy source',
        'Helps with digestion'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'orange',
      name: 'Orange',
      category: 'fruits',
      nutrients: {
        calories: 47,
        protein: 0.9,
        carbs: 12,
        fiber: 2.4,
        sugar: 9,
        vitamins: ['C', 'Folate'],
        minerals: ['Potassium']
      },
      benefits: [
        'Immune system booster',
        'High in vitamin C',
        'Supports skin health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      category: 'fruits',
      nutrients: {
        calories: 32,
        protein: 0.7,
        carbs: 8,
        fiber: 2,
        sugar: 5,
        vitamins: ['C', 'Folate'],
        minerals: ['Manganese', 'Potassium']
      },
      benefits: [
        'High in antioxidants',
        'Anti-inflammatory',
        'Heart healthy'
      ],
      allergens: ['berries'],
      ageRecommended: '8+ months'
    },
    {
      id: 'grapes',
      name: 'Grapes',
      category: 'fruits',
      nutrients: {
        calories: 69,
        protein: 0.7,
        carbs: 18,
        fiber: 0.9,
        sugar: 15,
        vitamins: ['K', 'C'],
        minerals: ['Potassium']
      },
      benefits: [
        'Rich in antioxidants',
        'Supports brain health',
        'Good for hydration'
      ],
      allergens: [],
      ageRecommended: '12+ months'
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      category: 'fruits',
      nutrients: {
        calories: 30,
        protein: 0.6,
        carbs: 8,
        fiber: 0.4,
        sugar: 6,
        vitamins: ['A', 'C'],
        minerals: ['Potassium']
      },
      benefits: [
        'Excellent hydration',
        'Low calorie',
        'Heart healthy'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    }
  ],
  vegetables: [
    {
      id: 'carrot',
      name: 'Carrot',
      category: 'vegetables',
      nutrients: {
        calories: 41,
        protein: 0.9,
        carbs: 10,
        fiber: 2.8,
        sugar: 5,
        vitamins: ['A', 'K', 'B6'],
        minerals: ['Potassium']
      },
      benefits: [
        'Excellent for eye health',
        'Rich in beta-carotene',
        'Supports immune system'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      category: 'vegetables',
      nutrients: {
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fiber: 2.6,
        sugar: 1.7,
        vitamins: ['C', 'K', 'Folate'],
        minerals: ['Iron', 'Potassium']
      },
      benefits: [
        'High in vitamins',
        'Supports bone health',
        'Anti-inflammatory'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'sweetpotato',
      name: 'Sweet Potato',
      category: 'vegetables',
      nutrients: {
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fiber: 3,
        sugar: 4,
        vitamins: ['A', 'C', 'B6'],
        minerals: ['Potassium', 'Manganese']
      },
      benefits: [
        'Rich in fiber',
        'Good source of energy',
        'Supports gut health'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'peas',
      name: 'Peas',
      category: 'vegetables',
      nutrients: {
        calories: 81,
        protein: 5.4,
        carbs: 14,
        fiber: 5.1,
        sugar: 6,
        vitamins: ['K', 'C', 'Folate'],
        minerals: ['Iron', 'Manganese']
      },
      benefits: [
        'High in protein',
        'Good source of fiber',
        'Supports blood sugar control'
      ],
      allergens: ['legumes'],
      ageRecommended: '6+ months'
    },
    {
      id: 'corn',
      name: 'Corn',
      category: 'vegetables',
      nutrients: {
        calories: 86,
        protein: 3.3,
        carbs: 19,
        fiber: 2,
        sugar: 6,
        vitamins: ['B1', 'B5', 'C'],
        minerals: ['Phosphorus', 'Magnesium']
      },
      benefits: [
        'Good energy source',
        'Contains antioxidants',
        'Supports eye health'
      ],
      allergens: ['corn'],
      ageRecommended: '8+ months'
    },
    {
      id: 'cucumber',
      name: 'Cucumber',
      category: 'vegetables',
      nutrients: {
        calories: 16,
        protein: 0.7,
        carbs: 4,
        fiber: 0.5,
        sugar: 2,
        vitamins: ['K', 'C'],
        minerals: ['Potassium', 'Magnesium']
      },
      benefits: [
        'Hydrating',
        'Low calorie',
        'Good for skin health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    }
  ],
  proteins: [
    {
      id: 'chicken',
      name: 'Chicken',
      category: 'proteins',
      nutrients: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B3', 'B6'],
        minerals: ['Phosphorus', 'Selenium']
      },
      benefits: [
        'High in protein',
        'Lean meat option',
        'Supports muscle growth'
      ],
      allergens: ['poultry'],
      ageRecommended: '6+ months'
    },
    {
      id: 'fish',
      name: 'Fish',
      category: 'proteins',
      nutrients: {
        calories: 206,
        protein: 22,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['D', 'B12'],
        minerals: ['Selenium', 'Iodine']
      },
      benefits: [
        'Rich in omega-3',
        'Brain development',
        'Heart healthy'
      ],
      allergens: ['fish'],
      ageRecommended: '8+ months'
    },
    {
      id: 'eggs',
      name: 'Eggs',
      category: 'proteins',
      nutrients: {
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fiber: 0,
        sugar: 1.1,
        vitamins: ['A', 'D', 'B12'],
        minerals: ['Iron', 'Phosphorus']
      },
      benefits: [
        'Complete protein',
        'Rich in choline',
        'Supports brain development'
      ],
      allergens: ['eggs'],
      ageRecommended: '6+ months'
    },
    {
      id: 'beans',
      name: 'Beans',
      category: 'proteins',
      nutrients: {
        calories: 339,
        protein: 21,
        carbs: 63,
        fiber: 15,
        sugar: 2,
        vitamins: ['Folate', 'B1'],
        minerals: ['Iron', 'Magnesium']
      },
      benefits: [
        'Plant-based protein',
        'High in fiber',
        'Heart healthy'
      ],
      allergens: ['legumes'],
      ageRecommended: '8+ months'
    },
    {
      id: 'tofu',
      name: 'Tofu',
      category: 'proteins',
      nutrients: {
        calories: 76,
        protein: 8,
        carbs: 2,
        fiber: 0.3,
        sugar: 0.7,
        vitamins: ['K'],
        minerals: ['Calcium', 'Iron']
      },
      benefits: [
        'Plant-based protein',
        'Good calcium source',
        'Low calorie'
      ],
      allergens: ['soy'],
      ageRecommended: '8+ months'
    },
    {
      id: 'nuts',
      name: 'Nuts',
      category: 'proteins',
      nutrients: {
        calories: 607,
        protein: 20,
        carbs: 21,
        fiber: 8,
        sugar: 5,
        vitamins: ['E', 'B6'],
        minerals: ['Magnesium', 'Phosphorus']
      },
      benefits: [
        'Healthy fats',
        'Good protein source',
        'Brain development'
      ],
      allergens: ['tree nuts'],
      ageRecommended: '12+ months'
    }
  ],
  grains: [
    {
      id: 'rice',
      name: 'Rice',
      category: 'grains',
      nutrients: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fiber: 0.4,
        sugar: 0.1,
        vitamins: ['B1', 'B3'],
        minerals: ['Manganese', 'Selenium']
      },
      benefits: [
        'Easy to digest',
        'Gluten-free',
        'Energy source'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'oats',
      name: 'Oats',
      category: 'grains',
      nutrients: {
        calories: 389,
        protein: 17,
        carbs: 66,
        fiber: 11,
        sugar: 0.9,
        vitamins: ['B1', 'B5'],
        minerals: ['Manganese', 'Phosphorus']
      },
      benefits: [
        'High in fiber',
        'Heart healthy',
        'Sustained energy'
      ],
      allergens: ['gluten'],
      ageRecommended: '6+ months'
    },
    {
      id: 'quinoa',
      name: 'Quinoa',
      category: 'grains',
      nutrients: {
        calories: 368,
        protein: 14,
        carbs: 64,
        fiber: 7,
        sugar: 1.6,
        vitamins: ['B1', 'B2', 'B6'],
        minerals: ['Manganese', 'Phosphorus']
      },
      benefits: [
        'Complete protein',
        'Gluten-free',
        'High in minerals'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    }
  ],
  dairy: [
    {
      id: 'milk',
      name: 'Milk',
      category: 'dairy',
      nutrients: {
        calories: 149,
        protein: 8,
        carbs: 12,
        fiber: 0,
        sugar: 12,
        vitamins: ['D', 'B12'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'Calcium for bones',
        'Protein source',
        'Vitamin D enriched'
      ],
      allergens: ['milk'],
      ageRecommended: '12+ months'
    },
    {
      id: 'yogurt',
      name: 'Yogurt',
      category: 'dairy',
      nutrients: {
        calories: 59,
        protein: 10,
        carbs: 4,
        fiber: 0,
        sugar: 4,
        vitamins: ['B12', 'B2'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'Probiotics for gut health',
        'High in protein',
        'Easy to digest'
      ],
      allergens: ['milk'],
      ageRecommended: '6+ months'
    },
    {
      id: 'cheese',
      name: 'Cheese',
      category: 'dairy',
      nutrients: {
        calories: 402,
        protein: 25,
        carbs: 1.3,
        fiber: 0,
        sugar: 0.5,
        vitamins: ['A', 'B12'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'High in calcium',
        'Good protein source',
        'Supports bone health'
      ],
      allergens: ['milk'],
      ageRecommended: '8+ months'
    }
  ]
};

export const getFoodById = (id) => {
  for (const category in foods) {
    const food = foods[category].find(f => f.id === id);
    if (food) return food;
  }
  return null;
};

export const getFoodsByCategory = (category) => {
  return foods[category] || [];
};

export const getFoodsByAge = (ageInMonths) => {
  const allFoods = [];
  for (const category in foods) {
    allFoods.push(...foods[category].filter(food => {
      const recommendedAge = parseInt(food.ageRecommended);
      return ageInMonths >= recommendedAge;
    }));
  }
  return allFoods;
};

export const searchFoods = (query) => {
  const searchTerm = query.toLowerCase();
  const results = [];
  
  for (const category in foods) {
    results.push(...foods[category].filter(food => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm)) ||
      food.vitamins.some(vitamin => vitamin.toLowerCase().includes(searchTerm)) ||
      food.minerals.some(mineral => mineral.toLowerCase().includes(searchTerm))
    ));
  }
  
  return results;
};