// HTML Elements
const appetizersBtn = document.getElementById("starter-btn");
const breakfastBtn = document.getElementById("breakfast-btn");
const dessertsBtn = document.getElementById("dessert-btn");
const pastaBtn = document.getElementById("pasta-btn");
const proteinsBtn = document.getElementById("proteins-btn");
const beefBtn = document.getElementById("beef-btn");
const chickenBtn = document.getElementById("chicken-btn");
const goatBtn = document.getElementById("goat-btn");
const lambBtn = document.getElementById("lamb-btn");
const porkBtn = document.getElementById("pork-btn");
const seafoodBtn = document.getElementById("seafood-btn");
const sidesBtn = document.getElementById("side-btn");
const veganBtn = document.getElementById("vegan-btn");
const vegetarianBtn = document.getElementById("vegetarian-btn");
const miscellaneousBtn = document.getElementById("miscellaneous-btn");
const recipesSearchWindow = document.querySelector(".recipes-search-window");
const recipesCardsWrapper = document.querySelector(".recipe-cards-wrapper");

// Array of Recipe Section Nav Buttons
let categoriesBtns = [
  appetizersBtn,
  breakfastBtn,
  dessertsBtn,
  pastaBtn,
  proteinsBtn,
  beefBtn,
  chickenBtn,
  goatBtn,
  lambBtn,
  porkBtn,
  seafoodBtn,
  sidesBtn,
  veganBtn,
  vegetarianBtn,
  miscellaneousBtn,
];

// Proteins Nav Button
const proteinsDropDownContainer = document.querySelector(
  ".proteins-drop-down-container"
);

function showAndHideList() {
  proteinsDropDownContainer.classList.toggle("hidden");
}

proteinsBtn.addEventListener("click", showAndHideList);

// Fetch the MealDB API for Meal Cards in the Browsing Display
async function fetchMealsByCategories(categoryName) {
  try {
    const apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
    const apiResponse = await fetch(apiURL);
    const apiArray = await apiResponse.json();
    return apiArray;
  } catch (error) {
    console.log(error);
  }
}

// Selecting a Category and Populating Meal Cards (Image and Name)
async function selectCategory(e) {
  // Highlights the selected category button to indicate it's been clicked
  for (let button of categoriesBtns) {
    button.classList.remove("selected-category");
  }
  e.target.classList.add("selected-category");

  // Grab the name of the category by splitting the ID of the clicked button on the "-" character (ex: "appetizers-btn" = appetizers)
  const categoryName = e.target.id.split("-")[0];

  // Fetch meals for the category that is selected
  let categoryData = null;
  if (categoryName === "proteins") {
    const beefData = await fetchMealsByCategories("beef");
    const chickenData = await fetchMealsByCategories("chicken");
    const porkData = await fetchMealsByCategories("pork");
    const lambData = await fetchMealsByCategories("lamb");
    const goatData = await fetchMealsByCategories("goat");
    const seafoodData = await fetchMealsByCategories("seafood");
    categoryData = {
      meals: [
        ...beefData.meals,
        ...chickenData.meals,
        ...porkData.meals,
        ...lambData.meals,
        ...goatData.meals,
        ...seafoodData.meals,
      ],
    };
  } else {
    categoryData = await fetchMealsByCategories(categoryName);
  }

  // Create meal display cards for each meal
  let cards = [];
  categoryData.meals.forEach((meal) => {
    const card = `<div class="recipe-card-container">
        <div class="recipe-card-img">
          <img src="${meal.strMealThumb}">
        </div>
        <div class="recipe-card-bottom">
          <div class="recipe-title">
            <h5>${meal.strMeal}</h5>
          </div>
        </div>
    </div>`;

    // Add card each time the loop runs to the collective group of mealCards
    cards.push(card);
  });

  // Display the mealCards in the recipeSearchWindow
  const recipesCardsWrapper = document.querySelector(".recipe-cards-wrapper");
  recipesCardsWrapper.innerHTML = cards.join("");
}

categoriesBtns.forEach((button) => {
  button.addEventListener("click", selectCategory);
});

// Populate Appetizers Category On Load
async function fetchAndDisplayAppetizers() {
  appetizersBtn.classList.add("selected-category");
  const appetizersData = await fetchMealsByCategories("starter");
  let cards = [];
  appetizersData.meals.forEach((meal) => {
    const card = `<div class="recipe-card-container" id="${meal.idMeal}">
        <div class="recipe-card-img">
          <img src="${meal.strMealThumb}">
        </div>
        <div class="recipe-card-bottom">
          <div class="recipe-title">
            <h5>${meal.strMeal}</h5>
          </div>
        </div>
    </div>`;
    cards.push(card);
  });
  recipesCardsWrapper.innerHTML = cards.join("");
}
// Call function so that it loads when page opens
fetchAndDisplayAppetizers();
