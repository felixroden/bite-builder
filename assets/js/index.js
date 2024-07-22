// API
import { getMealPlan } from "./api.js";

// Classes
import { Meal } from "./meal.js";
import { MealPlan } from "./mealPlan.js";
import { Recipe } from "./recipe.js";

let mealPlan;
let targetCalories;
const PATH_TO_RECIPE = "/bite-builder/html/recipe.html";
const IMAGE_SIZES = [
  "90x90",
  "240x150",
  "312x150",
  "312x231",
  "480x360",
  "556x370",
  "636x393",
];

const MEAL_PLAN_VIEW = document.getElementById("mealPlanView");
const MEAL_PLAN_BUTTON = document.getElementById("buildButton");
const CALORIES_INPUT = document.getElementById("caloriesInput");

window.onload = function () {
  initializeApp();
};

function initializeApp() {
  loadMealPlanFromStorage();
  setCopyrightYear();

  if (isHomePage()) {
    handleHomePage();
  }

  const mealId = parseInt(getParamFromUrl("id"));
  if (mealId) {
    handleRecipePage(mealId);
  }
}

function loadMealPlanFromStorage() {
  if (localStorage.getItem("mealPlan")) {
    mealPlan = restoreMealPlan();
  }
}

function isHomePage() {
  const url = window.location.href;
  return url.endsWith("bite-builder/") || url.endsWith("index.html");
}

function handleHomePage() {
  targetCalories = localStorage.getItem("targetCalories");
  if (targetCalories) {
    CALORIES_INPUT.value = targetCalories;
    showMeals();
  } else {
    viewHelperMessage();
  }
}

function handleRecipePage(mealId) {
  const meal = mealPlan.getMealById(mealId);
  if (meal) {
    createRecipe(meal);
    setPageTitle(meal);
  } else {
    console.error(`No meal found with id: ${mealId}`);
  }
}

// SOURCE https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get
function getParamFromUrl(param) {
  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get(param);
  return urlParam;
}

function setCopyrightYear() {
  const date = new Date();
  const year = date.getFullYear();
  document.getElementById("copyrightYear").innerText = year;
}

MEAL_PLAN_BUTTON.addEventListener("click", () => {
  const isValid = validateInput();
  if (!isValid) {
    alert("Please enter a value");
  } else {
    targetCalories = CALORIES_INPUT.value;
    localStorage.setItem("targetCalories", targetCalories);
    // SOURCE: https://www.w3schools.com/jsref/jsref_endswith.asp
    if (!isHomePage()) {
      window.location.href = "/bite-builder/index.html";
    } else {
      showMeals();
    }
  }
});

CALORIES_INPUT.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    MEAL_PLAN_BUTTON.click();
  }
});

function viewHelperMessage() {
  const helperMessage =
    "Input your target calories and click 'Build' to get a meal plan for the day.";
  createElement("p", MEAL_PLAN_VIEW, helperMessage, "helperMessage");
}

function setPageTitle(meal) {
  const title = meal.getTitle();
  document.title = "Recipe: " + title + " - BiteBuilder";
}

function clearMealCards() {
  MEAL_PLAN_VIEW.innerHTML = "";
}

function createElement(tag, parent, text, className) {
  let element = document.createElement(tag);
  if (text) {
    element.innerText = text;
  }
  if (className) {
    element.classList.add(className);
  }
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}

function createImage(meal, imageSize, className) {
  const image = meal.getImage(imageSize);
  let newImage = createElement("img", null, null, className);
  newImage.src = image;
  newImage.alt = meal.getTitle();
  return newImage;
}

async function createMealCard(meal) {
  const mealCard = createElement("article", MEAL_PLAN_VIEW, null, "mealCard");
  createElement("h2", mealCard, meal.type, "mealTypeHeader");
  const mealInfo = createElement("section", mealCard, null, "mealInfo");
  const titleImageContainer = createElement(
    "div",
    mealInfo,
    null,
    "titleImageContainer"
  );
  createElement("h3", titleImageContainer, meal.title, "mealTitle");
  const imageContainer = createElement("picture", titleImageContainer);

  const largeImageSource = createElement("source", imageContainer);
  largeImageSource.media = "(min-width: 1025px)";
  largeImageSource.srcset = meal.getImage(IMAGE_SIZES[4]);

  const mediumImageSource = createElement("source", imageContainer);
  mediumImageSource.media = "(min-width: 41px)";
  mediumImageSource.srcset = meal.getImage(IMAGE_SIZES[3]);

  const defaultImageElement = createImage(meal, IMAGE_SIZES[1], "mealImage");
  imageContainer.appendChild(defaultImageElement);

  mealInfo.appendChild(await createNutritionTable(meal));
  const recipeLinkContainer = createElement(
    "p",
    mealCard,
    null,
    "recipeLinkContainer"
  );
  const recipeLinkElement = createElement(
    "a",
    recipeLinkContainer,
    "View recipe",
    "recipeLink"
  );
  recipeLinkElement.href = `${PATH_TO_RECIPE}?id=${meal.getId()}`;
  recipeLinkElement.target = "_blank";
}

async function createIngredientsList(recipe) {
  const ingredients = await recipe.getIngredients();
  const ingredientsList = createElement("ul");
  ingredientsList.id = "ingredientsList";
  ingredients.forEach((ingredient) => {
    createElement("li", ingredientsList, ingredient);
  });
  return ingredientsList;
}

async function createInstructionList(recipe) {
  const instructions = await recipe.getInstructions();
  const instructionList = createElement("ol", null, null, "instructions");
  instructions.forEach((instruction) => {
    createElement("li", instructionList, instruction, "instructionStep");
  });
  return instructionList;
}

async function createRecipe(meal) {
  const recipe = new Recipe(meal);
  const title = meal.getTitle();
  const recipeView = document.getElementById("recipeView");
  const recipeArticle = createElement("article", recipeView, null, "recipe");
  const recipeHeader = createElement("header", recipeArticle);
  createElement("h2", recipeHeader, title, "recipeTitle");
  const picture = createElement("picture", recipeArticle);

  const largeImage = createElement("source", picture);
  largeImage.media = "(min-width: 450px)";
  largeImage.srcset = meal.getImage(IMAGE_SIZES[6]);

  const mediumImage = createElement("source", picture);
  mediumImage.media = "(min-width: 320px)";
  mediumImage.srcset = meal.getImage(IMAGE_SIZES[3]);

  const defaultImage = createImage(meal, IMAGE_SIZES[1], "recipeImage");
  picture.appendChild(defaultImage);
  const instructionSection = createElement(
    "section",
    recipeArticle,
    null,
    "instructionSection"
  );
  createElement("h3", instructionSection, "Instructions");
  const instructionsList = await createInstructionList(recipe);
  instructionSection.appendChild(instructionsList);

  const ingredientSection = createElement(
    "section",
    recipeArticle,
    null,
    "ingredientSection"
  );
  createElement("h3", ingredientSection, "Ingredients");
  const ingredientsList = await createIngredientsList(recipe);
  ingredientSection.appendChild(ingredientsList);
}

function validateInput() {
  let isValid = true;
  if (CALORIES_INPUT.value === "") {
    isValid = false;
  }
  return isValid;
}

function showTotalCalories() {
  const totalCaloriesText = createElement("p", MEAL_PLAN_VIEW);
  totalCaloriesText.id = "totalCaloriesText";
  createElement("span", totalCaloriesText, "Total calories: ", "boldTextSpan");
  const totalCaloriesNode = document.createTextNode(
    mealPlan.getTotalCalories() + " kcal"
  );
  totalCaloriesText.appendChild(totalCaloriesNode);
}

function createMealPlanFromData(mealsData, calories) {
  const meals = [];
  for (let i = 0; i < mealsData.length; i++) {
    let meal = mealsData[i];
    let mealId = meal.id;
    let mealTitle = meal.title;
    let mealType = meal.type;
    let newMeal = new Meal(mealId, mealTitle, mealType);
    meals.push(newMeal);
  }
  return new MealPlan(meals, calories);
}

function restoreMealPlan() {
  const storedData = JSON.parse(localStorage.getItem("mealPlan"));
  const restoredMealPlan = createMealPlanFromData(
    storedData.meals,
    storedData.totalCalories
  );
  return restoredMealPlan;
}

async function createMealPlan() {
  const mealPlanData = await getMealPlan(targetCalories);
  const meals = mealPlanData.meals;
  const nutrients = mealPlanData.nutrients;
  const calories = nutrients.calories;

  for (let i = 0; i < meals.length; i++) {
    setMealType(i, meals[i]);
  }

  return createMealPlanFromData(meals, calories);
}

async function showMeals() {
  targetCalories = localStorage.getItem("targetCalories");
  clearMealCards();
  mealPlan = await createMealPlan();
  const meals = mealPlan.getMeals();
  // SOURCE: https://www.freecodecamp.org/news/how-to-store-objects-or-arrays-in-browser-local-storage/
  localStorage.setItem("mealPlan", JSON.stringify(mealPlan));

  for (let i = 0; i < meals.length; i++) {
    const meal = meals[i];

    createMealCard(meal);
  }

  showTotalCalories();
  localStorage.removeItem("targetCalories");
}

function setMealType(mealNumber, meal) {
  let type;
  if (mealNumber === 0) {
    type = "breakfast";
  } else if (mealNumber === 1) {
    type = "lunch";
  } else if (mealNumber === 2) {
    type = "dinner";
  }
  meal.type = type;
}

async function createNutritionTable(meal) {
  let nutrition = await meal.getNutrition();
  const table = createElement("table", null, null, "nutritionTableMealCard");
  createElement("caption", table, "Nutrition Facts");
  const thead = createElement("thead", table);
  const tr = createElement("tr", thead);
  createElement("th", tr, "Attribute");
  createElement("th", tr, "Amount");
  const tbody = createElement("tbody", table);

  for (let nutrient in nutrition) {
    const tableRow = createElement("tr", tbody);

    createElement("td", tableRow, nutrient);
    createElement("td", tableRow, nutrition[nutrient]);
  }

  return table;
}
