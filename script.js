// Navigation
const navHomeBtn = document.getElementById("home");
const navWhatWeDoBtn = document.getElementById("whatwedo");
const navRecipesBtn = document.getElementById("recipes");
const navAboutUsBtn = document.getElementById("aboutus");

let navBtns = [navHomeBtn, navWhatWeDoBtn, navRecipesBtn, navAboutUsBtn];

function selectedNavSection(e) {
  for (let navBtn of navBtns) {
    navBtn.classList.remove("selected-section");
  }
  e.target.classList.add("selected-section");
}

navBtns.forEach((navBtn) => {
  navBtn.addEventListener("click", selectedNavSection);
});

// ----- HTML Elements -----
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
const recipeCardsWrapper = document.querySelector(".recipe-cards-wrapper");

// ----- Array of Recipe Section Nav Buttons -----
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

// ----- Proteins Nav Button -----
const proteinsDropDownContainer = document.querySelector(
  ".proteins-drop-down-container"
);
function showAndHideList() {
  proteinsDropDownContainer.classList.toggle("hidden");
}
proteinsBtn.addEventListener("click", showAndHideList);

// ----- Fetch the MealDB API for Meal Cards in the Browsing Display -----
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

// ----- Select a Category from Side Nav -----
async function selectCategory(e) {
  // Highlights the selected category button to indicate it's been clicked
  for (let button of categoriesBtns) {
    button.classList.remove("selected-category");
  }
  e.target.classList.add("selected-category");

  // Grab the name of the category by splitting the ID of the clicked button on the "-" character (ex: "appetizers-btn" = appetizers)
  const categoryName = e.target.id.split("-")[0];
  let mealResults = await fetchDataForCategory(categoryName);

  // Close Recipe and Open Browsing Page
  addHiddenClass("recipe-display-window");
  removeHiddenClass("recipes-search-window");
  const cards = createCard(mealResults);
  displayCards(cards);
}

// Event listener loop for left side nav buttons
categoriesBtns.forEach((button) => {
  button.addEventListener("click", selectCategory);
});

// --- Fetch Data for if the Proteins Button is clicked, otherwise fetch data for the category clicked ---
async function fetchDataForCategory(categoryName) {
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
    return categoryData;
  } else {
    categoryData = await fetchMealsByCategories(categoryName);
    return categoryData;
  }
}

// ----- Make a card and add it to the "cards" array -----
function createCard(categoryData) {
  let cards = [];
  categoryData.meals.forEach((meal) => {
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

    // Add card each time the loop runs to the "Cards" array
    cards.push(card);
  });
  return cards;
}

//  ----- Display Cards -----
function displayCards(cards) {
  // Display the mealCards in the recipeSearchWindow
  const recipesCardsWrapper = document.querySelector(".recipe-cards-wrapper");
  recipesCardsWrapper.innerHTML = cards.join("");

  const recipeCardContainer = document.querySelectorAll(
    ".recipe-card-container"
  );
  recipeCardContainer.forEach((card) => {
    card.addEventListener("click", generateRecipe);
  });
}

// ----- Populate Appetizers Category On Load -----
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
  recipeCardsWrapper.innerHTML = cards.join("");
  const recipeCardContainer = document.querySelectorAll(
    ".recipe-card-container"
  );
  recipeCardContainer.forEach((card) => {
    card.addEventListener("click", generateRecipe);
  });
}
// Call function so that it loads when page opens
fetchAndDisplayAppetizers();

// --------- Recipe Details Page ---------

// ----- Function that removes "Hidden" class -----
function removeHiddenClass(className) {
  document.querySelector(`.${className}`).classList.remove("hidden");
}

// ----- Function that adds "Hidden" class -----
function addHiddenClass(className) {
  document.querySelector(`.${className}`).classList.add("hidden");
}

// ----- Function that fetches the recipe API by mealID  -----
async function fetchMealById(mealId) {
  try {
    const apiURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    const apiResponse = await fetch(apiURL);
    const apiData = await apiResponse.json();
    return apiData.meals[0];
  } catch (error) {
    console.log(error);
  }
}

// ----- Function that builds the recipe page dynamically  -----
async function generateRecipe(e) {
  const mealId = e.target.closest(".recipe-card-container").id;
  const recipeInformation = await fetchMealById(mealId);
  const recipeIngredients = filterIngredients(recipeInformation);
  const recipeMeasures = filterMeasurments(recipeInformation);

  // LEARN THIS LATER
  let ingredientsHtml = "";
  const keys = Object.keys(recipeIngredients);
  for (let i = 0; i < keys.length; i++) {
    const ingredientKey = keys[i];
    const ingredientValue = recipeIngredients[ingredientKey];
    const measureKey = `strMeasure${i + 1}`;
    const measureValue = recipeMeasures[measureKey];

    ingredientsHtml += `
    <div class="ingredient-wrapper">
      <div class="ingredient-image">
        <img src="https://www.themealdb.com/images/ingredients/${ingredientValue}-Small.png" alt="${ingredientValue}" />
      </div>
      <div class="ingredient-text">
        <h6>${measureValue} ${ingredientValue}</h6>
      </div>
    </div>

    `;
  }
  // LEARN THIS LATER END

  const recipeHtml = `<div class="recipe-display-window">
  <div class="recipe-title">
    <h2>${recipeInformation.strMeal}</h2>
  </div>

  <!-- Image & Video Row -->
    <div class="image-video-row">
  <!-- Recipe Image -->
    <div class="recipe-image">
      <img src="${recipeInformation.strMealThumb}" alt="${
    recipeInformation.strMeal
  }" />
    </div>

    <!-- Video -->
    <div class="recipe-video">
      <iframe
        width="400"
        height="300"
        src="${recipeInformation.strYoutube.replace("watch?v=", "embed/")}"
        title="YouTube Video Player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>

  <!-- Recipe Ingredients & Instructions Section -->
    <div class="ingredients-instructions-row">
        <!-- Ingredients -->
        <div class="recipe-ingredients-wrapper">
          <div class="ingredients-title"><h5>Ingredients</h5></div>
          <div class="ingredients-container">
              ${ingredientsHtml}
          </div>
        </div>

        <!-- Instructions -->
        <div class="recipe-instructions-wrapper">
          <div class="instructions-title"><h5>Instructions</h5></div>
          <div class="instructions-text">
            <p>${recipeInformation.strInstructions}</p>
          </div>
        </div>
      </div>
    </div>`;

  addHiddenClass("recipes-search-window");
  displayRecipe(recipeHtml);
  removeHiddenClass("recipe-display-window");
}

// ----- Function that appends the recipe to the recipe-scroll-window  -----
function displayRecipe(recipeHtml) {
  const recipeScrollWindow = document.querySelector(".recipe-scroll-window");
  recipeScrollWindow.innerHTML = recipeHtml;
}

// helper functions
function filterIngredients(recipe) {
  const ingredients = {};
  // filtered out to have ingredient key-value-pairs
  for (const key in recipe) {
    const value = recipe[key];
    if (key.includes("strIngredient")) {
      ingredients[key] = value;
    }
  }

  const filteredIngredients = {};

  for (const key in ingredients) {
    const value = ingredients[key];
    if (value !== null && value !== "") {
      filteredIngredients[key] = value;
    }
  }

  return filteredIngredients;
}

function filterMeasurments(recipe) {
  const measures = {};
  // filtered out to have ingredient key-value-pairs
  for (const key in recipe) {
    const value = recipe[key];
    if (key.includes("strMeasure")) {
      measures[key] = value;
    }
  }

  const filteredMeasures = {};

  for (const key in measures) {
    const value = measures[key];
    if (value !== null && value !== "") {
      filteredMeasures[key] = value;
    }
  }

  return filteredMeasures;
}
