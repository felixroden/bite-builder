import { getInstructions, getIngredients } from "./api.js";

export class Recipe {
  constructor(meal) {
    this.id = meal.getId();
    this.title = meal.getTitle();
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  async getInstructions() {
    const instructionsData = await getInstructions(this.id);
    const instructions = instructionsData[0];
    const steps = [];

    for (let i = 0; i < instructions.steps.length; i++) {
      let step = instructions.steps[i].step;
      steps.push(step);
    }
    return steps;
  }

  async getIngredients() {
    const ingredientsData = await getIngredients(this.id);
    let ingredients = [];
    for (let i = 0; i < ingredientsData.ingredients.length; i++) {
      let item = ingredientsData.ingredients[i];
      let name = item.name;
      let amount = item.amount.metric.value;
      let unit = item.amount.metric.unit;
      ingredients.push(`${name}: ${amount} ${unit}`);
    }

    return ingredients;
  }
}
