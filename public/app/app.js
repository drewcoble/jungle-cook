var currentPage = "#home";

$(document).ready(function () {
  //connect to firebase
  JUNGLE_SERVICE.initFirebase(addListeners);
});

function addListeners() {
  //remove all listeners
  $(".home").off();
  $("#browse-recipes").off();
  $("#create-recipe").off();
  $("#your-recipes").off();
  $("#login").off();

  //add listeners to all nav links
  homeListener();
  browseListener();
  createRecipeListener();
  yourRecipesListener();
  loginListener();

  //remove the listener for the current page
  // $(currentPage).off();
}

function homeListener() {
  $(".home").click(function (e) {
    //toggle all nav 'active' classes off
    $(".nav-link").removeClass("active");
    //then toggle 'active' class on for 'home'
    $("#home").addClass("active");
    //remove all of the styling classes from content-container
    $("#content-container").removeClass();
    //add home-content class
    $("#content-container").addClass("home-content");
    //remove bg class
    $("#image-div").removeClass();
    //add bg class
    $("#image-div").addClass("home-bg");
    //replace the content with the home page
    $("#content-container").html(JUNGLE_SERVICE.getHomeContent());

    currentPage = "#home";
    addListeners();
    hideNav();
  });
}

function browseListener() {
  $("#browse-recipes").click(function (e) {
    //GET all recipes from db and pass them to displayBrowseRecipes()
    JUNGLE_SERVICE.getAllRecipes(displayBrowseRecipes);
    currentPage = "#browse-recipes";
  });
}

function yourRecipesListener() {
  $("#your-recipes").click(function (e) {
    //toggle all nav 'active' classes off
    $(".nav-link").removeClass("active");
    //then toggle 'active' class on for 'browse-recipes'
    $("#your-recipes").addClass("active");
    //remove content from page
    $("#content-container").html("");
    //remove all of the styling classes from content-container
    $("#content-container").removeClass();
    //add class with browse-content styles
    $("#content-container").addClass("browse-content");
    //remove bg class
    $("#image-div").removeClass();
    //add bg class
    $("#image-div").addClass("browse-bg");
    //GET all recipes from db and pass them to displayBrowseRecipes()
    JUNGLE_SERVICE.getAllRecipes(displayYourRecipes);
    currentPage = "#your-recipes";
    addListeners();
    hideNav();
  });
}

function displayBrowseRecipes(data) {
  $(window).scrollTop(0);
  //toggle all nav 'active' classes off
  $(".nav-link").removeClass("active");
  //then toggle 'active' class on for 'browse-recipes'
  $("#browse-recipes").addClass("active");
  //remove content from page
  $("#content-container").html("");
  //remove all of the styling classes from content-container
  $("#content-container").removeClass();
  //add class with browse-content styles
  $("#content-container").addClass("browse-content");
  //remove bg class
  $("#image-div").removeClass();
  //add bg class
  $("#image-div").addClass("browse-bg");
  $("#content-container").html(`<h2>Recipes: Try some today!</h2>
  <div class="recipe-container"></div>`);
  $(".recipe-container").html();
  let recipesContent = "";
  data.forEach(function (doc) {
    let id = doc.id;
    let data = doc.data();
    // console.log(id, data);
    let recipe = `
    <div class='recipe-box'>
     <div class="recipe">
      <div class="recipe-image" style="background:url(images/${data.image}); background-size: cover; background-position: center;">
      <div id='${id}' class="recipe-button">View</div>
      </div>
        <div class="recipe-info">
        <h3 class="recipe-name">${data.name}</h3>
        <p class="recipe-text">
          ${data.description}
        </p>
        <div class="recipe-bottom">
          <div class="rec-bot-info">
            <div class="time-pic"></div>
            <div>${data.time}</div>
          </div>
          <div class="rec-bot-info">
            <div class="servings-pic"></div>
            <div>${data.servings} servings</div>
          </div>
        </div>
        </div>
      </div>
    </div>`;
    recipesContent += recipe;
  });
  $(".recipe-container").html(recipesContent);
  //animate recipes in
  let recipesArray = $(".recipe").toArray();
  // console.log($(".recipe").length);
  for (let i = 0; i < recipesArray.length; i++) {
    let animDelay = 0.33 * i;
    recipesArray[
      i
    ].style.animation = `browse-elements-in 0.6s ${animDelay}s both`;
    recipesArray[i].style.display = "flex";
  }
  //add nav listeners
  addListeners();
  hideNav();
  //add the required listeners for this recipe (view, edit, delete)
  addRecipeListeners();
}

function displayYourRecipes(data) {
  $("#content-container").html(`<h2>Hey, here are your recipes!</h2>
  <div class="recipe-container"></div>`);
  $(".recipe-container").html();
  let recipesContent = "";
  data.forEach(function (doc) {
    let id = doc.id;
    let data = doc.data();
    // console.log(id, data);
    let recipe = `
    <div class='recipe-box'>
     <div class="recipe">
      <div class="recipe-image" style="background:url(images/${data.image}); background-size: cover; background-position: center;">
      <div id='${id}' class="recipe-button">View</div>
      </div>
        <div class="recipe-info">
        <h3 class="recipe-name">${data.name}</h3>
        <p class="recipe-text">
          ${data.description}
        </p>
        <div class="recipe-bottom">
          <div class="rec-bot-info">
            <div class="time-pic"></div>
            <div>${data.time}</div>
          </div>
          <div class="rec-bot-info">
            <div class="servings-pic"></div>
            <div>${data.servings} servings</div>
          </div>
        </div>
        </div>
      </div>
      <div class="buttonBin">
      <div class="edit-delete-button edit" id="${doc.id}">Edit Recipe</div>
      <div class="edit-delete-button delete" id="${doc.id}">Delete</div>
    </div>
    </div>`;
    recipesContent += recipe;
  });
  $(".recipe-container").html(recipesContent);
  //animate recipes in
  let recipesArray = $(".recipe").toArray();
  // console.log($(".recipe").length);
  for (let i = 0; i < recipesArray.length; i++) {
    let animDelay = 0.33 * i;
    recipesArray[
      i
    ].style.animation = `browse-elements-in 0.6s ${animDelay}s both`;
    recipesArray[i].style.display = "flex";
  }
  //add the required listeners for this recipe (view, edit, delete)
  addRecipeListeners();
}

function addRecipeListeners() {
  //add handler for when recipe-button div is clicked
  $(".recipe-button").click(function (event) {
    targetId = event.target.id;
    // console.log("addRecipeListeners id: " + targetId);
    //remove all of the styling classes from content-container
    $("#content-container").removeClass();
    //add class returned from JUNGLE_SERVICE
    $("#content-container").addClass("recipe-details-content");
    //remove bg class
    $("#image-div").removeClass();
    //add bg class
    $("#image-div").addClass("recipe-details-bg");
    //get the recipe details from db, then pass them to displayRecipeDetails()
    JUNGLE_SERVICE.getRecipeDetails(targetId, displayRecipeDetails);
    // currentPage = "#recipe-details";
    addListeners();
    hideNav();
  });
  //
  //
  // click handler for edit recipe button
  $(".edit").click(function (event) {
    let id = event.target.id;
    console.log("Edit button clicked for recipe with id: " + id);
    //toggle all nav 'active' classes off
    $(".nav-link").removeClass("active");
    //remove all of the styling classes from content-container
    $("#content-container").removeClass();
    //add class
    $("#content-container").addClass("create-edit-content");
    //remove bg class
    $("#image-div").removeClass();
    //add bg class
    $("#image-div").addClass("create-edit-bg");
    //replace the content with the edit-recipe page
    JUNGLE_SERVICE.getRecipeDetails(id, displayEditRecipe);
    //add listeners to nav
    addListeners();
    hideNav();
    //add listeners to buttons on page
    createEditPageListeners();
  });
  //
  //
  // click handler for delete recipe button
  $(".delete").click(function (event) {
    let id = event.target.id;
    console.log("Delete button clicked for recipe with id: " + id);
    //make the user confirm they want to delete the recipe
    displayAlert(`<h2 id="alert-message">Are you sure you want to delete this recipe?</h2>
    <div class="alert-buttons">
      <div id="delete">Delete</div>
      <div id="cancel">Cancel</div>
    </div>`);
    //create a listener for the delete button
    $("#delete").click(function () {
      hideAlert();
      JUNGLE_SERVICE.deleteRecipe(id, displayAlert);
    });
  });
  //
  //
}

function displayRecipeDetails(data) {
  hideAlert();
  // console.log("displayRecipeDetails data: ");
  if (!data) {
    $("#content-container").html(
      "We are having trouble displaying this recipe."
    );
  }
  let doc = data.data();
  // console.log(data);
  let pageContent = `
  <div class="recipe-top-div">
      <div class="recipe-top-left">
        <div class="recipe-name">
          ${doc.name}
        </div>
        <div class="recipe-image-div" style="background:url(images/${doc.image}); background-size: cover; background-position: center;"></div>
      </div>
      <div class="recipe-info-div">
        <h1>Description:</h1>
        <p>
          ${doc.description}
        </p>
        <h1>Total Time:</h1>
        <p>${doc.time}</p>
        <h1>Servings:</h1>
        <p>${doc.servings} servings</p>
      </div>
    </div>
    <!-- END of recipe-top-div -->

    <div class="recipe-bottom-div">
      <div class="recipe-details-div">
        <h2>Ingredients:</h2>
        <p>`;
  doc.ingredients.forEach(function (ingredient) {
    pageContent += `${ingredient}<br/>`;
  });

  pageContent += `</p>
      </div>
      <div class="recipe-details-div">
        <h2>Instructions:</h2>
        <ol>`;

  doc.instructions.forEach(function (instruction) {
    pageContent += `<li>${instruction}</li>`;
  });

  pageContent += `</ol>
      </div>
      <div class='button-container'>
        <div id="${data.id}" class="edit-button">Edit Recipe</div>
        <div id='${data.id}' class='delete-button'>Delete Recipe</div>
      </div>
    </div>
    <!-- END of recipe-bottom-div -->`;
  $(".recipe-details-content").html(pageContent);

  //add listener for "edit-button" button
  editRecipeListener(doc);
  deleteRecipeListener();
}

function createRecipeListener() {
  $("#create-recipe").click(function (e) {
    //toggle all nav 'active' classes off
    $(".nav-link").removeClass("active");
    //then toggle 'active' class on for 'browse-recipes'
    $("#create-recipe").addClass("active");
    //remove all of the styling classes from content-container
    $("#content-container").removeClass();
    //add class returned from JUNGLE_SERVICE
    $("#content-container").addClass("create-edit-content");
    //remove bg class
    $("#image-div").removeClass();
    //add bg class
    $("#image-div").addClass("create-edit-bg");
    //replace the content with the browse-recipes page
    $("#content-container").html(JUNGLE_SERVICE.getCreateRecipeContent());
    currentPage = "#create-recipe";
    //add listeners to nav
    addListeners();
    hideNav();

    //TODO: add listener to page buttons
    createEditPageListeners();
  });
}

function editRecipeListener() {
  $(".edit-button").click(function (event) {
    let targetId = event.target.id;
    // console.log(targetId);

    //replace the content with the edit-recipe page
    JUNGLE_SERVICE.getRecipeDetails(targetId, displayEditRecipe);
  });
}

function displayEditRecipe(data) {
  //toggle all nav 'active' classes off
  $(".nav-link").removeClass("active");
  //remove all of the styling classes from content-container
  $("#content-container").removeClass();
  //add class
  $("#content-container").addClass("create-edit-content");
  //remove bg class
  $("#image-div").removeClass();
  //add bg class
  $("#image-div").addClass("create-edit-bg");

  let doc = data.data();
  let pageContent = `<h2>Hey, edit your recipe!</h2>
  <div class="details-div">
    <div class="input-div">
      <input id='recImage' type="text" value="${doc.image}" />
    </div>
    <input id='recName' type="text" value="${doc.name}" />
    <input id='recDescription' type="text" value="${doc.description}" />
    <input id='recTime' type="text" value="${doc.time}" />
    <input id='recServings' type="text" placeholder="Number of Servings" value="${doc.servings}" />
  </div>

  <div id="ingredients-container" class="details-div">
    <h3>Enter Ingredients:</h3>`;
  for (let i = 0; i <= doc.ingredients.length; i++) {
    if (i == doc.ingredients.length) {
      pageContent += `<div class="input-div">
      <input class='recIngredients' type="text" placeholder="Ingredient #${
        i + 1
      }" />
      <div class="add-row-button">+</div>
    </div>`;
    } else {
      pageContent += `<div class="input-div"><input class='recIngredients' type="text" value="${doc.ingredients[i]}" /></div>`;
    }
  }
  pageContent += `</div>
  <div id='instructions-container' class="details-div">
    <h3>Enter Instructions:</h3>`;
  for (let i = 0; i <= doc.instructions.length; i++) {
    if (i == doc.instructions.length) {
      pageContent += `<div class="input-div">
        <input class='recInstructions' type="text" placeholder="Instruction #${
          i + 1
        }" />
        <div class="add-row-button">+</div>
      </div>`;
    } else {
      pageContent += `<div class="input-div"><input class='recInstructions' type="text" value="${doc.instructions[i]}" /></div>`;
    }
  }
  pageContent += `</div>
  </div>
  <div id="${data.id}" class="submit-recipe-button">Submit Changes</div>`;
  $("#content-container").html(pageContent);
  //add listeners to nav
  addListeners();
  hideNav();
  //add listeners to buttons on page
  createEditPageListeners();
}

function deleteRecipeListener() {
  $(".delete-button").click(function (event) {
    let recipeId = event.target.id;
    // console.log(recipeId);
    //make the user confirm they want to delete the recipe
    displayAlert(`<h2 id="alert-message">Are you sure you want to delete this recipe?</h2>
    <div class="alert-buttons">
      <div id="delete">Delete</div>
      <div id="cancel">Cancel</div>
    </div>`);
    //create a listener for the delete button
    $("#delete").click(function () {
      JUNGLE_SERVICE.deleteRecipe(recipeId, displayAlert);
    });
  });
}

function createEditPageListeners() {
  //get rid of old event listeners
  $("#ingredients-container .add-row-button").off();
  $("#instructions-container .add-row-button").off();
  //
  //listener for "attach image" button
  //
  // ignore the image button for now, it is not an assignment requirement
  //
  //
  //listener for ingredients + button (add another row for ingredients)
  $("#ingredients-container .add-row-button").click(function (event) {
    //hide the + button that is currently displayed
    event.target.style.display = "none";
    //add the new row with a + button that is displayed
    $("#ingredients-container").append(`<div class="input-div">
    <input class='recIngredients' type="text" placeholder="New Ingredient" />
    <div class="add-row-button">+</div>
  </div>`);
    //add new listener to the new button
    createEditPageListeners();
  });
  //
  //listener for instructions + button
  $("#instructions-container .add-row-button").click(function (event) {
    //hide the + button that is currently displayed
    event.target.style.display = "none";
    //add the new row with a + button that is displayed
    $("#instructions-container").append(`<div class="input-div">
    <input class='recInstructions' type="text" placeholder="New Instruction" />
    <div class="add-row-button">+</div>
  </div>`);
    //add new listener to the new button
    createEditPageListeners();
  });
  //
  //
  //
  //listener for create/edit recipe button
  $(".submit-recipe-button").click(function (event) {
    // get recipe id; if creating a recipe, this sets it as "new"
    let recipeId = event.target.id;
    // console.log("submit button clicked with id: " + recipeId);
    // create an object and from info on form and pass it to service.js to send it to db
    let newRecipeObj = {
      description: "",
      image: "",
      ingredients: [],
      instructions: [],
      name: "",
      servings: "",
      time: "",
    };
    newRecipeObj.description = $("#recDescription").val().trim();
    newRecipeObj.image = $("#recImage").val().trim();
    newRecipeObj.name = $("#recName").val().trim();
    newRecipeObj.servings = $("#recServings").val().trim();
    newRecipeObj.time = $("#recTime").val().trim();
    //loop thru ingredients and push them to the object array
    let recIngredientsArray = $(".recIngredients").toArray();
    for (let i = 0; i < recIngredientsArray.length; i++) {
      if (recIngredientsArray[i].value.length > 0) {
        // console.log(recIngredientsArray[i].value);
        newRecipeObj.ingredients.push(recIngredientsArray[i].value);
      }
    }
    //loop thru instructions and push them to the object array
    let recInstructionsArray = $(".recInstructions").toArray();
    for (let i = 0; i < recInstructionsArray.length; i++) {
      if (recInstructionsArray[i].value.length > 0) {
        // console.log(recIngredientsArray[i].value);
        newRecipeObj.instructions.push(recInstructionsArray[i].value);
      }
    }
    //
    //
    //the object is set!
    //
    //
    //check to see if editing or creating by checking id
    if (recipeId != "new") {
      //this means it is an EDIT
      //display the alert box and ask user to confirm
      displayAlert(`<h2 id="alert-message">Are you sure you want to edit this recipe?</h2>
    <div class="alert-buttons">
      <div id="confirm">Confirm</div>
      <div id="cancel">Cancel</div>
    </div>`);
      //add event listeners for the confirm and cancel button
      $("#confirm").click(function () {
        //change alert box to be like "working on it..."
        hideAlert();
        //
        //call function from service.js to update recipe
        JUNGLE_SERVICE.editRecipe(newRecipeObj, recipeId, displayAlert);
        //
      });
    } else {
      // this is a CREATE
      //display the alert box and ask user to confirm
      displayAlert(`<h2 id="alert-message">Are you sure you want to create this recipe?</h2>
            <div class="alert-buttons">
              <div id="confirm">Confirm</div>
              <div id="cancel">Cancel</div>
            </div>`);
      //add event listeners for the confirm and cancel button
      $("#confirm").click(function () {
        //change alert box to be like "working on it..."
        hideAlert();
        //
        //call function from service.js to update recipe
        JUNGLE_SERVICE.createRecipe(newRecipeObj, displayAlert);
        //
      });
    }

    // console.log(recipeId, newRecipeObj);
  });
}

function loginListener() {
  $("#login").click(function (e) {
    //toggle all nav 'active' classes off
    $(".nav-link").removeClass("active");
    //replace the content with the login page
    $("#content-container").html(JUNGLE_SERVICE.getLoginContent().content);
    //remove all of the styling classes from content-container
    $("#content-container").removeClass();
    //add class returned from JUNGLE_SERVICE
    $("#content-container").addClass(
      JUNGLE_SERVICE.getLoginContent().className
    );
    //remove bg class
    $("#image-div").removeClass();
    //add bg class
    $("#image-div").addClass("login-bg");
    currentPage = "#login";
    addListeners();
    hideNav();
  });
}

//add click listener to hamburger menu button to display/hide menu options
$(".nav-menu-button").click(function (e) {
  console.log("menu icon clicked");

  //if the nav is in view
  if ($(".nav-menu-button").hasClass("animate-menu-icon-left")) {
    hideNav();
    //
  } else {
    //if the nav is out of view
    showNav();
  }
});

function showNav() {
  $(".nav-menu-button").removeClass("animate-menu-icon-right");
  $(".nav-menu-button").addClass("animate-menu-icon-left");
  $(".nav-right").css("display", "flex");
  $(".nav-right").removeClass("animate-nav-out");
  $(".nav-right").addClass("animate-nav-in");
}

function hideNav() {
  $(".nav-menu-button").removeClass("animate-menu-icon-left");
  $(".nav-menu-button").addClass("animate-menu-icon-right");
  $(".nav-right").removeClass("animate-nav-in");
  $(".nav-right").addClass("animate-nav-out");
}

function displayAlert(message) {
  $(".alert-container").css("display", "flex");
  $(".alert-box").html(message);
  //add click listener to hide alert box
  $("#cancel").click(function () {
    hideAlert();
  });
}

function hideAlert() {
  $(".alert-container").css("display", "none");
}
