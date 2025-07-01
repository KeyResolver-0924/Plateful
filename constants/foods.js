// Import food images
import apple from '../assets/images/foods/apple.png';
import avocado from '../assets/images/foods/avocado.png';
import banana from '../assets/images/foods/banana.png';
import beans from '../assets/images/foods/beans.png';
import beef from '../assets/images/foods/beef.png';
import bread from '../assets/images/foods/bread.png';
import broccoli from '../assets/images/foods/broccoli.png';
import butter from '../assets/images/foods/butter.png';
import carrots from '../assets/images/foods/carrots.png';
import cheese from '../assets/images/foods/cheese.png';
import chicken from '../assets/images/foods/chicken.png';
import cucumber from '../assets/images/foods/cucumber.png';
import egg from '../assets/images/foods/egg.png';
import fish from '../assets/images/foods/fish.png';
import grapes from '../assets/images/foods/grapes.png';
import milk from '../assets/images/foods/milk.png';
import nuts from '../assets/images/foods/nuts.png';
import orange from '../assets/images/foods/orange.png';
import pasta from '../assets/images/foods/pasta.png';
import peach from '../assets/images/foods/peach.png';
import pear from '../assets/images/foods/pear.png';
import rice from '../assets/images/foods/rice.png';
import spinach from '../assets/images/foods/spinach.png';
import strawberry from '../assets/images/foods/strawberry.png';
import sweetpotato from '../assets/images/foods/sweetpotato.png';
import tofu from '../assets/images/foods/tofu.png';
import tomato from '../assets/images/foods/tomato.png';
import turkey from '../assets/images/foods/turkey.png';
import watermelon from '../assets/images/foods/watermelon.png';
import yogurt from '../assets/images/foods/yogurt.png';

export const foods = {
  fruits: [
    {
      id: 'apple',
      name: 'Apple',
      category: 'fruits',
      image: apple,
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
      image: banana,
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
      image: orange,
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
      image: strawberry,
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
      image: grapes,
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
      image: watermelon,
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
    },
    {
      id: 'peach',
      name: 'Peach',
      category: 'fruits',
      image: peach,
      nutrients: {
        calories: 39,
        protein: 0.9,
        carbs: 10,
        fiber: 1.5,
        sugar: 8,
        vitamins: ['A', 'C'],
        minerals: ['Potassium']
      },
      benefits: [
        'Good source of fiber',
        'Supports skin health',
        'Easy to digest'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'pear',
      name: 'Pear',
      category: 'fruits',
      image: pear,
      nutrients: {
        calories: 57,
        protein: 0.4,
        carbs: 15,
        fiber: 3.1,
        sugar: 10,
        vitamins: ['C', 'K'],
        minerals: ['Copper', 'Potassium']
      },
      benefits: [
        'High in fiber',
        'Supports digestion',
        'Low glycemic index'
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
      image: carrots,
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
        'Supports immune system',
        'Good for skin'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      category: 'vegetables',
      image: broccoli,
      nutrients: {
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fiber: 2.6,
        sugar: 1.5,
        vitamins: ['C', 'K', 'A'],
        minerals: ['Iron', 'Calcium']
      },
      benefits: [
        'High in antioxidants',
        'Supports bone health',
        'Anti-inflammatory'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'spinach',
      name: 'Spinach',
      category: 'vegetables',
      image: spinach,
      nutrients: {
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fiber: 2.2,
        sugar: 0.4,
        vitamins: ['A', 'C', 'K', 'Folate'],
        minerals: ['Iron', 'Calcium']
      },
      benefits: [
        'Excellent source of iron',
        'Supports bone health',
        'Anti-inflammatory'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'cucumber',
      name: 'Cucumber',
      category: 'vegetables',
      image: cucumber,
      nutrients: {
        calories: 16,
        protein: 0.7,
        carbs: 3.6,
        fiber: 0.5,
        sugar: 1.7,
        vitamins: ['K', 'C'],
        minerals: ['Potassium']
      },
      benefits: [
        'Excellent hydration',
        'Low calorie',
        'Supports digestion'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'sweetpotato',
      name: 'Sweet Potato',
      category: 'vegetables',
      image: sweetpotato,
      nutrients: {
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fiber: 3,
        sugar: 4.2,
        vitamins: ['A', 'C', 'B6'],
        minerals: ['Potassium', 'Manganese']
      },
      benefits: [
        'Excellent source of vitamin A',
        'Supports eye health',
        'Good for digestion'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'tomato',
      name: 'Tomato',
      category: 'vegetables',
      image: tomato,
      nutrients: {
        calories: 18,
        protein: 0.9,
        carbs: 3.9,
        fiber: 1.2,
        sugar: 2.6,
        vitamins: ['C', 'K', 'A'],
        minerals: ['Potassium']
      },
      benefits: [
        'Rich in lycopene',
        'Supports heart health',
        'Anti-inflammatory'
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
      image: chicken,
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
        'Excellent protein source',
        'Supports muscle growth',
        'Easy to digest'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'beef',
      name: 'Beef',
      category: 'proteins',
      image: beef,
      nutrients: {
        calories: 250,
        protein: 26,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B12', 'B6'],
        minerals: ['Iron', 'Zinc']
      },
      benefits: [
        'Rich in iron',
        'Supports brain development',
        'Excellent protein source'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'fish',
      name: 'Fish',
      category: 'proteins',
      image: fish,
      nutrients: {
        calories: 206,
        protein: 22,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['D', 'B12'],
        minerals: ['Omega-3', 'Selenium']
      },
      benefits: [
        'Rich in omega-3',
        'Supports brain development',
        'Heart healthy'
      ],
      allergens: ['fish'],
      ageRecommended: '12+ months'
    },
    {
      id: 'egg',
      name: 'Egg',
      category: 'proteins',
      image: egg,
      nutrients: {
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fiber: 0,
        sugar: 1.1,
        vitamins: ['D', 'B12', 'A'],
        minerals: ['Iron', 'Selenium']
      },
      benefits: [
        'Complete protein source',
        'Supports brain development',
        'Rich in choline'
      ],
      allergens: ['eggs'],
      ageRecommended: '8+ months'
    },
    {
      id: 'tofu',
      name: 'Tofu',
      category: 'proteins',
      image: tofu,
      nutrients: {
        calories: 76,
        protein: 8,
        carbs: 1.9,
        fiber: 0.3,
        sugar: 0.6,
        vitamins: ['B1', 'B6'],
        minerals: ['Calcium', 'Iron']
      },
      benefits: [
        'Plant-based protein',
        'Good for bone health',
        'Low in saturated fat'
      ],
      allergens: ['soy'],
      ageRecommended: '12+ months'
    },
    {
      id: 'turkey',
      name: 'Turkey',
      category: 'proteins',
      image: turkey,
      nutrients: {
        calories: 189,
        protein: 29,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B6', 'B12'],
        minerals: ['Iron', 'Zinc']
      },
      benefits: [
        'Lean protein source',
        'Supports muscle growth',
        'Heart healthy'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    }
  ],
  grains: [
    {
      id: 'rice',
      name: 'Rice',
      category: 'grains',
      image: rice,
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
      image: bread,
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
      image: pasta,
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
    },
    {
      id: 'beans',
      name: 'Beans',
      category: 'grains',
      image: beans,
      nutrients: {
        calories: 127,
        protein: 9,
        carbs: 23,
        fiber: 6,
        sugar: 0.3,
        vitamins: ['B1', 'B6', 'Folate'],
        minerals: ['Iron', 'Magnesium']
      },
      benefits: [
        'Excellent fiber source',
        'Plant-based protein',
        'Supports heart health'
      ],
      allergens: [],
      ageRecommended: '12+ months'
    }
  ],
  dairy: [
    {
      id: 'milk',
      name: 'Milk',
      category: 'dairy',
      image: milk,
      nutrients: {
        calories: 42,
        protein: 3.4,
        carbs: 5,
        fiber: 0,
        sugar: 5,
        vitamins: ['D', 'B12', 'A'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'Excellent calcium source',
        'Supports bone health',
        'Complete protein'
      ],
      allergens: ['milk'],
      ageRecommended: '12+ months'
    },
    {
      id: 'cheese',
      name: 'Cheese',
      category: 'dairy',
      image: cheese,
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
        'Rich in calcium',
        'Supports bone health',
        'Good protein source'
      ],
      allergens: ['milk'],
      ageRecommended: '12+ months'
    },
    {
      id: 'yogurt',
      name: 'Yogurt',
      category: 'dairy',
      image: yogurt,
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
        'Probiotic benefits',
        'Supports gut health',
        'Excellent protein source'
      ],
      allergens: ['milk'],
      ageRecommended: '8+ months'
    }
  ],
  fats: [
    {
      id: 'avocado',
      name: 'Avocado',
      category: 'fats',
      image: avocado,
      nutrients: {
        calories: 160,
        protein: 2,
        carbs: 9,
        fiber: 7,
        sugar: 0.7,
        vitamins: ['K', 'E', 'C'],
        minerals: ['Potassium', 'Folate']
      },
      benefits: [
        'Healthy fats',
        'Supports brain development',
        'Heart healthy'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'butter',
      name: 'Butter',
      category: 'fats',
      image: butter,
      nutrients: {
        calories: 717,
        protein: 0.9,
        carbs: 0.1,
        fiber: 0,
        sugar: 0.1,
        vitamins: ['A', 'D', 'E'],
        minerals: ['Calcium']
      },
      benefits: [
        'Good for brain development',
        'Source of fat-soluble vitamins',
        'Energy dense'
      ],
      allergens: ['milk'],
      ageRecommended: '12+ months'
    },
    {
      id: 'nuts',
      name: 'Nuts',
      category: 'fats',
      image: nuts,
      nutrients: {
        calories: 607,
        protein: 20,
        carbs: 21,
        fiber: 12,
        sugar: 4.2,
        vitamins: ['E', 'B1'],
        minerals: ['Magnesium', 'Zinc']
      },
      benefits: [
        'Healthy fats',
        'Supports brain health',
        'Good protein source'
      ],
      allergens: ['tree nuts'],
      ageRecommended: '12+ months'
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