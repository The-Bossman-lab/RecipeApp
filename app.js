const categoriesDiv = document.querySelector(".categories-div");

showCategories()

async function get(url) {
    const respons = await fetch(url);
    return respons.json();
}

async function showCategories() {
    const categoriesResp = await get("https://www.themealdb.com/api/json/v1/1/categories.php");
    categoriesResp.categories.forEach((ctgr) => {
        if (ctgr.strCategory != "Pork") {
            const ctgrName = ctgr.strCategory;
            const ctgrThumbLink = ctgr.strCategoryThumb;
            const ctrgDescription = ctgr.strCategoryDescription;
            const categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category");
            categoryDiv.innerHTML += `<img src="${ctgrThumbLink}">
                <div class="category-text">
                <a href = "#">${ctgrName}</a> 
                <p>${ctrgDescription}</p>`;
            categoriesDiv.appendChild(categoryDiv);
        }
    })
    getCategoriesMeals()
}

function getCategoriesMeals() {
    const mealsAvailable = document.querySelector(".mealsAvailable");
    const links = document.querySelectorAll(".category-text>a");
    links.forEach(a => {
        a.addEventListener("click", async(e) => {
            console.log(e.target.textContent);
            const category = e.target.textContent;
            const arrayOfMeals = await get(
                `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
            );
            const mealsInCategory = arrayOfMeals.meals;
            console.log(mealsInCategory);

            categoriesDiv.classList.add("remove");
            mealsInCategory.forEach((meal) => {
                mealsAvailable.innerHTML += `<div class="meal-available"> <img class='img-meal' src="${meal.strMealThumb}"> <a class='link-meal' href="#">${meal.strMeal}</a> </div>`;
            });
            mealsAvailable.classList.remove("remove");
        });
    });
    showMealPreparation()
};

function getMealDetails(meal) {
    console.log(meal);
    // meal.addEventListener("click", (e) => {
    //     console.log(e.target);
    //     // if (e.target === ) {

    //     // } else {

    //     // }
    // });
};
// getCategoriesMeals(meals)


function showMealPreparation() {
    const mealsAvailable = document.querySelector(".mealsAvailable");
    mealsAvailable.addEventListener("click", async(e) => {
        console.log(e.target.classList.contains("img-meal"));
        if (e.target.classList.contains("img-meal")) {
            const mealName = e.target.nextElementSibling.textContent;

            showPreparation(mealName);

        } else if (e.target.classList.contains("link-meal")) {
            const mealName = e.target.textContent;
            showPreparation(mealName)
        }
    })
}

async function showPreparation(mealName) {
    const mealsAvailable = document.querySelector(".mealsAvailable");
    const instructions = document.querySelector(".meal-instructions");
    instructions.innerHTML = '';
    let mealDetails = await get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    mealsAvailable.classList.add("remove");
    mealDetails = mealDetails.meals[0];
    const ingredients = getIngredients(mealDetails);
    console.log(ingredients);
    const ingredientsUL = document.createElement('ul')
    ingredients.forEach((ingredient) => {
        const li = document.createElement('li')
        li.textContent = ingredient;

        ingredientsUL.appendChild(li);
    });
    console.log(mealDetails);
    instructions.innerHTML = `
        <h4>${mealDetails.strMeal}</h4>
        <img src="${mealDetails.strMealThumb}" alt="">
        <h5>Meal ingredients: </h5>
        <ul>${ingredientsUL.innerHTML}</ul>
        
        <h6>Instructions:</h6>
        <p>${mealDetails.strInstructions}</p>`;

    instructions.classList.remove('remove')

}

function getIngredients(mealObj) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (mealObj["strIngredient" + i]) {
            ingredients.push(`${mealObj["strMeasure" + i]} / ${mealObj["strIngredient" + i]}`);
        } else {
            break
        }
    }
    return ingredients
}