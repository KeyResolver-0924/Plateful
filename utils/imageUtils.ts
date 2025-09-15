import { ImageSourcePropType } from 'react-native';
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Map normalized food names to their static image requires
const foodImageMap: Record<string, ImageSourcePropType> = {
  //carbohydrates
  "rice" : require(`${BASE_URL}/images/Food/Carbohydrate/rice.png`),
  "butternut" : require(`${BASE_URL}/images/Food/Carbohydrate/butternut.png`),
  "sweet_potato" : require(`${BASE_URL}/images/Food/Carbohydrate/sweetpotato.png`),
  "potato" : require(`${BASE_URL}/images/Food/Carbohydrate/potato.png`),
  "corn" : require(`${BASE_URL}/images/Food/Carbohydrate/corn.png`),
  "oat" : require(`${BASE_URL}/images/Food/Carbohydrate/oat.png`),
  "pasta" : require(`${BASE_URL}/images/Food/Carbohydrate/pasta.png`),
  "pumpkin" : require(`${BASE_URL}/images/Food/Carbohydrate/pumpkin.png`),
  "quinoa" : require(`${BASE_URL}/images/Food/Carbohydrate/quinoa.png`),

  //Dairy
  "milk" : require(`${BASE_URL}/images/Food/Dairy/milk.png`),
  "cheese" : require(`${BASE_URL}/images/Food/Dairy/cheese.png`),
  "yogurt" : require(`${BASE_URL}/images/Food/Dairy/yogurt.png`),
  "butter" : require(`${BASE_URL}/images/Food/Dairy/butter.png`),
  "cream" : require(`${BASE_URL}/images/Food/Dairy/cream.png`),
  "cottage_cheese" : require(`${BASE_URL}/images/Food/Dairy/cottagecheese.png`),
  "ice_cream" : require(`${BASE_URL}/images/Food/Dairy/icecream.png`),

  //Fats
  "chocolate" : require(`${BASE_URL}/images/Food/Fats/chocolate.png`),
  "coconut" : require(`${BASE_URL}/images/Food/Fats/coconut.png`),
  "olive" : require(`${BASE_URL}/images/Food/Fats/olive.png`),
  "nut" : require(`${BASE_URL}/images/Food/Fats/nut.png`),
  "salmon" : require(`${BASE_URL}/images/Food/Fats/salmon.png`),

  //Proteins
  "chicken" : require(`${BASE_URL}/images/Food/Protein/chicken.png`),
  "egg" : require(`${BASE_URL}/images/Food/Protein/egg.png`),
  "fish" : require(`${BASE_URL}/images/Food/Protein/fish.png`),
  "almond" : require(`${BASE_URL}/images/Food/Protein/almond.png`),
  "pea" : require(`${BASE_URL}/images/Food/Protein/pea.png`),
  "tofu" : require(`${BASE_URL}/images/Food/Protein/tofu.png`),
  "beef" : require(`${BASE_URL}/images/Food/Protein/beef.png`),

  //Fruits
  "apple" : require(`${BASE_URL}/images/Food/Fruit/apple.png`),
  "apricot" : require(`${BASE_URL}/images/Food/Fruit/apricot.png`),
  "avocado" : require(`${BASE_URL}/images/Food/Fruit/avocado.png`),
  "banana" : require(`${BASE_URL}/images/Food/Fruit/banana.png`),
  "blueberry" : require(`${BASE_URL}/images/Food/Fruit/blueberry.png`),
  "blackberry" : require(`${BASE_URL}/images/Food/Fruit/blackberry.png`),
  "cantaloupe" : require(`${BASE_URL}/images/Food/Fruit/cantaloupe.png`),
  "cherry" : require(`${BASE_URL}/images/Food/Fruit/cherry.png`),
  "fig" : require(`${BASE_URL}/images/Food/Fruit/fig.png`),
  "grape" : require(`${BASE_URL}/images/Food/Fruit/grape.png`),
  "grapefruit" : require(`${BASE_URL}/images/Food/Fruit/grapefruit.png`),
  "kiwi" : require(`${BASE_URL}/images/Food/Fruit/kiwi.png`),
  "lemon" : require(`${BASE_URL}/images/Food/Fruit/lemon.png`),
  "lime" : require(`${BASE_URL}/images/Food/Fruit/lime.png`),
  "mango" : require(`${BASE_URL}/images/Food/Fruit/mango.png`),
  "orange" : require(`${BASE_URL}/images/Food/Fruit/orange.png`),
  "peach" : require(`${BASE_URL}/images/Food/Fruit/peach.png`),
  "pear" : require(`${BASE_URL}/images/Food/Fruit/pear.png`),
  "plum" : require(`${BASE_URL}/images/Food/Fruit/plum.png`),
  "strawberry" : require(`${BASE_URL}/images/Food/Fruit/strawberry.png`),
  "tangerine" : require(`${BASE_URL}/images/Food/Fruit/tangerine.png`),
  "watermelon" : require(`${BASE_URL}/images/Food/Fruit/watermelon.png`),

  //Vegetables
  "asparagus" : require(`${BASE_URL}/images/Food/Vegetable/asparagus.png`),
  "beet" : require(`${BASE_URL}/images/Food/Vegetable/beet.png`),
  "broccoli" : require(`${BASE_URL}/images/Food/Vegetable/broccoli.png`),
  "bell_pepper" : require(`${BASE_URL}/images/Food/Vegetable/bellpepper.png`),
  "carrot" : require(`${BASE_URL}/images/Food/Vegetable/carrot.png`),
  "cabbage" : require(`${BASE_URL}/images/Food/Vegetable/cabbage.png`),
  "cucumber" : require(`${BASE_URL}/images/Food/Vegetable/cucumber.png`),
  "eggplant" : require(`${BASE_URL}/images/Food/Vegetable/eggplant.png`),
  "garlic" : require(`${BASE_URL}/images/Food/Vegetable/garlic.png`),
  "mushroom" : require(`${BASE_URL}/images/Food/Vegetable/mushroom.png`),
  "onion" : require(`${BASE_URL}/images/Food/Vegetable/onion.png`),
  "radish" : require(`${BASE_URL}/images/Food/Vegetable/radish.png`),
  "spinach" : require(`${BASE_URL}/images/Food/Vegetable/spinach.png`),
  "tomato" : require(`${BASE_URL}/images/Food/Vegetable/tomato.png`),
  "zucchini" : require(`${BASE_URL}/images/Food/Vegetable/zucchini.png`),
};

const fallbackImage: ImageSourcePropType = require(`${BASE_URL}/images/Characters/Box.png`);

const normalizeFoodName = (name: string): string => {
  const lowered = (name || '').toLowerCase().trim();
  // keep underscores if provided by JSON, remove extra spaces/hyphens
  const normalized = lowered
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');
  return normalized;
};

export const getFoodImageSource = (foodName: string): ImageSourcePropType => {
  const key = normalizeFoodName(foodName);
  return foodImageMap[key] || fallbackImage;
};

export default getFoodImageSource;


