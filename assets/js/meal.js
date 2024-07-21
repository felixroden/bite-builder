import { getNutrition } from "./api.js";
export class Meal {
  constructor(id, title, type) {
    this.id = id;
    this.title = title;
    this.type = type;
  }

  async getNutrition() {
    const nutritionData = await getNutrition(this.id);
    return {
      calories: nutritionData.calories,
      carbs: nutritionData.carbs,
      fat: nutritionData.fat,
      protein: nutritionData.protein,
    };
  }

  getImage(size) {
    const image = `https://img.spoonacular.com/recipes/${this.id}-${size}.jpg`;
    return image;
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }
}
