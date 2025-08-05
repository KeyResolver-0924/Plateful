export interface Food {
  id: string;
  name: string;
  category: string;
  icon: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    sugar: number;
    vitamins: string[];
    minerals: string[];
  };
  benefits: string[];
  allergens: string[];
  ageRecommended: string;
}

export interface FoodsByCategory {
  fruits: Food[];
  vegetables: Food[];
  proteins: Food[];
  grains: Food[];
  dairy: Food[];
}

export const foods: FoodsByCategory = {
  fruits: [
    {
      id: 'apple',
      name: 'Apple',
      category: 'fruits',
      icon: require('../assets/images/foods/apple.png'),
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
      icon: require('../assets/images/foods/banana.png'),
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
      icon: require('../assets/images/foods/orange.png'),
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
      icon: require('../assets/images/foods/strawberry.png'),
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
      icon: require('../assets/images/foods/grapes.png'),
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
      icon: require('../assets/images/foods/watermelon.png'),
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
      icon: require('../assets/images/foods/carrot.png'),
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
      icon: require('../assets/images/foods/broccoli.png'),
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
      icon: require('../assets/images/foods/sweetpotato.png'),
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
      id: 'beans',
      name: 'Beans',
      category: 'vegetables',
      icon: require('../assets/images/foods/beans.png'),
      nutrients: {
        calories: 81,
        protein: 5.4,
        carbs: 14,
        fiber: 5.7,
        sugar: 6,
        vitamins: ['K', 'C', 'Folate'],
        minerals: ['Iron', 'Manganese']
      },
      benefits: [
        'High in protein',
        'Good source of fiber',
        'Supports bone health'
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
      icon: require('../assets/images/foods/chicken.png'),
      nutrients: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B6', 'B12'],
        minerals: ['Iron', 'Zinc']
      },
      benefits: [
        'High in protein',
        'Easy to digest',
        'Supports muscle growth'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'fish',
      name: 'Fish',
      category: 'proteins',
      icon: require('../assets/images/foods/fish.png'),
      nutrients: {
        calories: 84,
        protein: 20,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['D', 'B12'],
        minerals: ['Omega-3', 'Iodine']
      },
      benefits: [
        'Brain development',
        'Heart healthy',
        'Rich in omega-3'
      ],
      allergens: ['fish'],
      ageRecommended: '12+ months'
    },
    {
      id: 'eggs',
      name: 'Eggs',
      category: 'proteins',
      icon: require('../assets/images/foods/egg.png'),
      nutrients: {
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fiber: 0,
        sugar: 1.1,
        vitamins: ['D', 'B12', 'Choline'],
        minerals: ['Iron', 'Selenium']
      },
      benefits: [
        'Complete protein',
        'Brain development',
        'Eye health'
      ],
      allergens: ['eggs'],
      ageRecommended: '8+ months'
    }
  ],
  grains: [
    {
      id: 'rice',
      name: 'Rice',
      category: 'grains',
      icon: require('../assets/images/foods/rice.png'),
      nutrients: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fiber: 0.4,
        sugar: 0.1,
        vitamins: ['B1', 'B6'],
        minerals: ['Iron', 'Magnesium']
      },
      benefits: [
        'Easy to digest',
        'Good energy source',
        'Gentle on stomach'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'oats',
      name: 'Oats',
      category: 'grains',
      icon: require('../assets/images/foods/maize .png'),
      nutrients: {
        calories: 68,
        protein: 2.4,
        carbs: 12,
        fiber: 1.7,
        sugar: 0.3,
        vitamins: ['B1', 'B6'],
        minerals: ['Iron', 'Zinc']
      },
      benefits: [
        'High in fiber',
        'Heart healthy',
        'Sustained energy'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    }
  ],
  dairy: [
    {
      id: 'yogurt',
      name: 'Yogurt',
      category: 'dairy',
      icon: require('../assets/images/foods/yogurt.png'),
      nutrients: {
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fiber: 0,
        sugar: 3.2,
        vitamins: ['B12', 'D'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'Probiotics',
        'Bone health',
        'Digestive health'
      ],
      allergens: ['milk'],
      ageRecommended: '8+ months'
    },
    {
      id: 'cheese',
      name: 'Cheese',
      category: 'dairy',
      icon: require('../assets/images/foods/cheese.png'),
      nutrients: {
        calories: 113,
        protein: 7,
        carbs: 0.4,
        fiber: 0,
        sugar: 0.4,
        vitamins: ['A', 'B12'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'High in calcium',
        'Protein source',
        'Bone development'
      ],
      allergens: ['milk'],
      ageRecommended: '12+ months'
    }
  ]
};

export const getFoodById = (id: string): Food | undefined => {
  for (const category of Object.values(foods)) {
    const food = category.find((f: Food) => f.id === id);
    if (food) return food;
  }
  return undefined;
};

export const getFoodsByCategory = (category: keyof FoodsByCategory): Food[] => {
  return foods[category] || [];
};

export const getFoodsByAge = (ageInMonths: number): Food[] => {
  const allFoods: Food[] = Object.values(foods).flat();
  return allFoods.filter(food => {
    if (!food.ageRecommended) return false;
    const ageStr = food.ageRecommended.replace(/\D/g, '');
    const recommendedAge = parseInt(ageStr);
    return ageInMonths >= recommendedAge;
  });
};

export const searchFoods = (query: string): Food[] => {
  const allFoods: Food[] = Object.values(foods).flat();
  const lowercaseQuery = query.toLowerCase();
  
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery) ||
    food.benefits.some(benefit => 
      benefit.toLowerCase().includes(lowercaseQuery)
    )
  );
}; 