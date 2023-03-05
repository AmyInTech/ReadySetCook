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
  console.log(recipeInformation);
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
          
            <!-- Single Ingredient 1 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient1
                }-Small.png" alt="${recipeInformation.strIngredient1}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure1} ${
    recipeInformation.strIngredient1
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 2 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient2
                }-Small.png" alt="${recipeInformation.strIngredient2}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure2} ${
    recipeInformation.strIngredient2
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 3 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient3
                }-Small.png" alt="${recipeInformation.strIngredient3}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure3} ${
    recipeInformation.strIngredient3
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 4 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient4
                }-Small.png" alt="${recipeInformation.strIngredient4}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure4} ${
    recipeInformation.strIngredient4
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 5 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient5
                }-Small.png" alt="${recipeInformation.strIngredient5}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure5} ${
    recipeInformation.strIngredient5
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 6 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient6
                }-Small.png" alt="${recipeInformation.strIngredient6}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure6} ${
    recipeInformation.strIngredient6
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 7 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient7
                }-Small.png" alt="${recipeInformation.strIngredient7}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure7} ${
    recipeInformation.strIngredient7
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 8 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient8
                }-Small.png" alt="${recipeInformation.strIngredient8}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure8} ${
    recipeInformation.strIngredient8
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 9 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient9
                }-Small.png" alt="${recipeInformation.strIngredient9}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure9} ${
    recipeInformation.strIngredient9
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 10 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient10
                }-Small.png" alt="${recipeInformation.strIngredient10}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure10} ${
    recipeInformation.strIngredient10
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 11 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient11
                }-Small.png" alt="${recipeInformation.strIngredient11}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure11} ${
    recipeInformation.strIngredient11
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 12 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient12
                }-Small.png" alt="${recipeInformation.strIngredient12}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure12} ${
    recipeInformation.strIngredient12
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 13 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient13
                }-Small.png" alt="${recipeInformation.strIngredient13}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure13} ${
    recipeInformation.strIngredient13
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 14 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient14
                }-Small.png" alt="${recipeInformation.strIngredient14}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure14} ${
    recipeInformation.strIngredient14
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 15 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient15
                }-Small.png" alt="${recipeInformation.strIngredient15}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure15} ${
    recipeInformation.strIngredient15
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 16 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient16
                }-Small.png" alt="${recipeInformation.strIngredient16}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure16} ${
    recipeInformation.strIngredient16
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 17 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient17
                }-Small.png" alt="${recipeInformation.strIngredient17}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure17} ${
    recipeInformation.strIngredient17
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 18 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient18
                }-Small.png" alt="${recipeInformation.strIngredient18}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure18} ${
    recipeInformation.strIngredient18
  }</h6>
              </div>
            </div>
          
            <!-- Single Ingredient 19 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient19
                }-Small.png" alt="${recipeInformation.strIngredient19}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure19} ${
    recipeInformation.strIngredient19
  }</h6>
              </div>
            </div>

            <!-- Single Ingredient 20 -->
            <div class="ingredient-wrapper">
              <div class="ingredient-image">
                <img src="https://www.themealdb.com/images/ingredients/${
                  recipeInformation.strIngredient20
                }-Small.png" alt="${recipeInformation.strIngredient20}" />
              </div>
              <div class="ingredient-text">
                <h6>${recipeInformation.strMeasure20} ${
    recipeInformation.strIngredient20
  }</h6>
              </div>
            </div>
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
