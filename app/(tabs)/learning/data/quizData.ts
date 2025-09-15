import foodsData from '../../../../db/foods.json';
import { Question } from '../types/navigation';

/**
 * Extracts all quiz questions from foods.json data
 * Converts the quiz format from foods.json to the Question interface format
 */
const extractQuestionsFromFoods = (): Question[] => {
  const questions: Question[] = [];
  
  // Helper function to extract questions from individual food items
  const extractQuestionsForFood = (foodKey: string, foodData: any, category: string) => {
    if (foodData.quiz && Array.isArray(foodData.quiz)) {
      foodData.quiz.forEach((q: any, index: number) => {
        questions.push({
          id: `${foodKey}_${q.id || index}`,
          question: q.question,
          options: q.options,
          correct_answer: q.options[q.correct_answer.charCodeAt(0) - 65] || '',
          correct_index: q.correct_answer.charCodeAt(0) - 65,
          category: category,
          difficulty: 'EASY',
          explanation: q.explanation || ''
        });
      });
    }
  };

  // Process all food categories from foods.json
  const categories = ['fruits', 'vegetables', 'proteins', 'carbohydrates', 'dairy', 'fats'] as const;
  
  categories.forEach(category => {
    const categoryData = foodsData.categories[category as keyof typeof foodsData.categories];
    if (categoryData?.foods) {
      Object.entries(categoryData.foods).forEach(([key, data]) => {
        extractQuestionsForFood(key, data, category.charAt(0).toUpperCase() + category.slice(1));
      });
    }
  });

  return questions;
};

// Extract all questions from foods.json
const allQuestions = extractQuestionsFromFoods();

/**
 * Quiz data organized by category
 * All data comes directly from foods.json - no custom questions
 */
const QUIZ_DATA = {
  fruits: allQuestions.filter(q => q.category === 'Fruits'),
  vegetables: allQuestions.filter(q => q.category === 'Vegetables'), 
  proteins: allQuestions.filter(q => q.category === 'Proteins'),
  carbohydrates: allQuestions.filter(q => q.category === 'Carbohydrates'),
  dairy: allQuestions.filter(q => q.category === 'Dairy'),
  fats: allQuestions.filter(q => q.category === 'Fats'),
  all: allQuestions
};

export default QUIZ_DATA;
