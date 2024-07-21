export class MealPlan {
  constructor(meals, totalCalories) {
    this.meals = meals;
    this.totalCalories = totalCalories;
  }

  getMealById(id) {
    // SOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    return this.meals.find((meal) => meal.id === id);
  }

  getMeals() {
    return this.meals;
  }

  getTotalCalories() {
    return this.totalCalories;
  }
}
