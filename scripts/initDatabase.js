const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// Note: You'll need to download a service account key from Firebase Console
// and place it in the root directory as 'serviceAccountKey.json'
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeDatabase() {
  console.log('Starting database initialization...');

  try {
    // Initialize food categories
    await initializeFoodCategories();
    
    // Initialize food database
    await initializeFoodDatabase();
    
    // Initialize app configuration
    await initializeAppConfig();
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

async function initializeFoodCategories() {
  console.log('Initializing food categories...');
  
  const categories = [
    { id: 'fruits', name: 'Fruits', description: 'Fresh fruits and berries', icon: '🍎' },
    { id: 'vegetables', name: 'Vegetables', description: 'Fresh vegetables', icon: '🥬' },
    { id: 'proteins', name: 'Proteins', description: 'Meat, fish, eggs, legumes', icon: '🥩' },
    { id: 'grains', name: 'Grains', description: 'Bread, rice, pasta, cereals', icon: '🍞' },
    { id: 'dairy', name: 'Dairy', description: 'Milk, cheese, yogurt', icon: '🥛' },
    { id: 'fats', name: 'Fats', description: 'Oils, nuts, butter', icon: '🥜' },
    { id: 'sweets', name: 'Sweets', description: 'Candy, chocolate, desserts', icon: '🍫' }
  ];

  for (const category of categories) {
    await db.collection('foodCategories').doc(category.id).set(category);
  }
  
  console.log(`Created ${categories.length} food categories`);
}

async function initializeFoodDatabase() {
  console.log('Initializing food database...');
  
  const foods = [
    // Fruits
    {
      id: 'apple',
      name: 'Apple',
      category: 'fruits',
      nutrients: {
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fiber: 2.4,
        vitaminC: 4.6,
        potassium: 107
      },
      imageUrl: 'foods/apple.png',
      suitableFor: ['6m+'],
      allergens: [],
      description: 'Sweet and crunchy fruit rich in fiber and vitamin C'
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
        potassium: 358,
        vitaminB6: 0.4
      },
      imageUrl: 'foods/banana.png',
      suitableFor: ['6m+'],
      allergens: [],
      description: 'Soft, sweet fruit rich in potassium and easy to digest'
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      category: 'fruits',
      nutrients: {
        calories: 32,
        protein: 0.7,
        carbs: 8,
        fiber: 2.0,
        vitaminC: 58.8,
        folate: 24
      },
      imageUrl: 'foods/strawberry.png',
      suitableFor: ['8m+'],
      allergens: [],
      description: 'Sweet berries rich in vitamin C and antioxidants'
    },
    
    // Vegetables
    {
      id: 'carrot',
      name: 'Carrot',
      category: 'vegetables',
      nutrients: {
        calories: 41,
        protein: 0.9,
        carbs: 10,
        fiber: 2.8,
        vitaminA: 835,
        vitaminK: 13.2
      },
      imageUrl: 'foods/carrot.png',
      suitableFor: ['6m+'],
      allergens: [],
      description: 'Orange root vegetable rich in vitamin A and beta-carotene'
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
        vitaminC: 89.2,
        vitaminK: 101.6
      },
      imageUrl: 'foods/broccoli.png',
      suitableFor: ['8m+'],
      allergens: [],
      description: 'Green vegetable rich in vitamins C and K'
    },
    
    // Proteins
    {
      id: 'chicken',
      name: 'Chicken',
      category: 'proteins',
      nutrients: {
        calories: 165,
        protein: 31,
        fat: 3.6,
        iron: 1.0,
        zinc: 1.8
      },
      imageUrl: 'foods/chicken.png',
      suitableFor: ['8m+'],
      allergens: [],
      description: 'Lean protein source rich in essential amino acids'
    },
    {
      id: 'egg',
      name: 'Egg',
      category: 'proteins',
      nutrients: {
        calories: 155,
        protein: 13,
        fat: 11,
        vitaminD: 1.1,
        choline: 147
      },
      imageUrl: 'foods/egg.png',
      suitableFor: ['8m+'],
      allergens: ['eggs'],
      description: 'Complete protein source with essential nutrients'
    },
    
    // Grains
    {
      id: 'rice',
      name: 'Rice',
      category: 'grains',
      nutrients: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fiber: 0.4,
        iron: 0.2
      },
      imageUrl: 'foods/rice.png',
      suitableFor: ['6m+'],
      allergens: [],
      description: 'Staple grain that is easy to digest'
    },
    {
      id: 'bread',
      name: 'Bread',
      category: 'grains',
      nutrients: {
        calories: 265,
        protein: 9,
        carbs: 49,
        fiber: 2.7,
        iron: 3.6
      },
      imageUrl: 'foods/bread.png',
      suitableFor: ['8m+'],
      allergens: ['wheat', 'gluten'],
      description: 'Staple food made from flour and water'
    },
    
    // Dairy
    {
      id: 'milk',
      name: 'Milk',
      category: 'dairy',
      nutrients: {
        calories: 42,
        protein: 3.4,
        carbs: 5,
        fat: 1,
        calcium: 113,
        vitaminD: 1.2
      },
      imageUrl: 'foods/milk.png',
      suitableFor: ['12m+'],
      allergens: ['milk'],
      description: 'Rich source of calcium and vitamin D'
    },
    {
      id: 'yogurt',
      name: 'Yogurt',
      category: 'dairy',
      nutrients: {
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fat: 0.4,
        calcium: 110,
        probiotics: true
      },
      imageUrl: 'foods/yogurt.png',
      suitableFor: ['8m+'],
      allergens: ['milk'],
      description: 'Fermented dairy product with probiotics'
    }
  ];

  for (const food of foods) {
    await db.collection('foods').doc(food.id).set(food);
  }
  
  console.log(`Created ${foods.length} food items`);
}

async function initializeAppConfig() {
  console.log('Initializing app configuration...');
  
  const appConfig = {
    version: '1.0.0',
    features: {
      cameraRecognition: true,
      mealTracking: true,
      nutritionAnalytics: true,
      gamification: true
    },
    settings: {
      maxImageSize: 5 * 1024 * 1024, // 5MB
      supportedImageTypes: ['image/jpeg', 'image/png'],
      maxMealsPerDay: 10,
      maxChildrenPerUser: 5
    }
  };

  await db.collection('appConfig').doc('main').set(appConfig);
  
  // Add intro video configuration
  const introVideo = {
    url: 'https://example.com/intro-video.mp4',
    title: 'Welcome to Plateful',
    description: 'Learn how to track your child\'s nutrition'
  };
  
  await db.collection('appConfig').doc('introVideo').set(introVideo);
  
  console.log('App configuration initialized');
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 