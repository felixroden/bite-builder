const API_KEY = "9a851d63b2524c4380d416fc2e5a680c";
const BASE_URL = "https://api.spoonacular.com";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function getMealPlan(targetCalories) {
  const url = `${BASE_URL}/mealplanner/generate?timeFrame=day&targetCalories=${targetCalories}&apiKey=${API_KEY}`;
  return await fetchData(url);
}

export async function getInstructions(recipeId) {
  const url = `${BASE_URL}/recipes/${recipeId}/analyzedInstructions?apiKey=${API_KEY}`;
  return await fetchData(url);
}

export async function getNutrition(recipeId) {
  const url = `${BASE_URL}/recipes/${recipeId}/nutritionWidget.json?apiKey=${API_KEY}`;
  return await fetchData(url);
}

export async function getIngredients(recipeId) {
  const url = `${BASE_URL}/recipes/${recipeId}/ingredientWidget.json?apiKey=${API_KEY}`;
  return await fetchData(url);
}
