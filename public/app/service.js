var JUNGLE_SERVICE = (function () {
  var _db;

  var _initFirebase = function (callback) {
    // initiate connection to firebase
    firebase
      .auth()
      .signInAnonymously()
      .then(function (result) {
        console.log("connected to firebase");
        _db = firebase.firestore();
        //once firebase is connected, init buttons through callback function
        callback();
      });
  };

  var _getAllRecipes = function (callback) {
    _db
      .collection("Recipes")
      .get()
      .then(function (querySnapshot) {
        // console.log(querySnapshot);
        callback(querySnapshot);
      });
  };

  var _getRecipeDetails = function (id, callback) {
    // console.log("getRecipeDetails: " + id);
    _db
      .collection("Recipes")
      .doc(id)
      .get()
      .then(function (querySnapshot) {
        callback(querySnapshot);
      });
  };

  var _editRecipe = function (recipeObj, id, callback) {
    // console.log("EditRecipe Service, recipeObj: " + recipeObj);
    _db
      .collection("Recipes")
      .doc(id)
      .set(recipeObj)
      .then(function () {
        callback(`<h2 id="alert-message">Recipe was successfully edited!</h2>
        <div class="alert-buttons">
          <div id="cancel">OK</div>
        </div>`);
        _getAllRecipes(displayBrowseRecipes);
      })
      .catch(function () {
        console.log("Problem editing recipe.", id, recipeObj);
      });
  };

  var _createRecipe = function (newRecipeObj, callback) {
    console.log("CreateRecipe Service, newRecipeObj: " + newRecipeObj);
    _db
      .collection("Recipes")
      .add(newRecipeObj)
      .then(function (docRef) {
        console.log("Document added with id: " + docRef.id);
        callback(`<h2 id="alert-message">Recipe was successfully created!</h2>
        <div class="alert-buttons">
          <div id="cancel">OK</div>
        </div>`);
        _getAllRecipes(displayBrowseRecipes);
      });
  };

  var _deleteRecipe = function (recipeId, callback) {
    _db
      .collection("Recipes")
      .doc(recipeId)
      .delete()
      .then(function () {
        callback(`<h2 id="alert-message">Recipe successfully deleted.</h2>
    <div class="alert-buttons">
      <div id="cancel">OK</div>
    </div>`);
        _getAllRecipes(displayBrowseRecipes);
      });
  };

  var _getHomeContent = function () {
    let contentString = `<div class="y-circle">
      <h2>The Jungle Cook</h2>
      <p>
        The home to various recipes of your choice. Add your own recipe
        today and fill the world with joy!
      </p>
    </div>
    <div class="p-circle">
      <p>
        Want to be a Jungle<br />
        Cook? Go ahead and<br />
        the kitchen is yours!
      </p>
    </div>`;

    return contentString;
  };

  var _getBrowseContent = function () {
    let className = "browse-content";
    let contentString = `<h2>Recipes: Try some today!</h2>
    <div class="recipe-container"></div>`;
    return { className: className, content: contentString };
  };

  var _getYourRecipesContent = function () {
    let className = "browse-content";
    let contentString = `<h2>Hey, here are your recipes!</h2>
    <div class="recipe-container">
      <div class="recipe-box">
        <div class="recipe">
          <div class="recipe-image pizza">
            <div class="recipe-button">View</div>
          </div>
          <div class="recipe-info">
            <h3 class="recipe-name">Supreme Pizza</h3>
            <p class="recipe-text">
              Make pizza night super duper out of this world with homemade
              pizza. This recipe is supreme with vegetables and two types
              of meat. Yum!
            </p>
            <div class="recipe-bottom">
              <div class="rec-bot-info">
                <div class="time-pic"></div>
                <div>1h 24min</div>
              </div>
              <div class="rec-bot-info">
                <div class="servings-pic"></div>
                <div>4 servings</div>
              </div>
            </div>
          </div>
        </div>
        <div class="buttonBin">
          <div class="edit-delete-button" id="edit">Edit Recipe</div>
          <div class="edit-delete-button" id="delete">Delete</div>
        </div>
      </div>
      <div class="recipe-box">
        <div class="recipe">
          <div class="recipe-image burger">
            <div class="recipe-button">View</div>
          </div>
          <div class="recipe-info">
            <h3 class="recipe-name">Classic Burger</h3>
            <p class="recipe-text">
              Sink your teeth into a delicious restaurant-style, hamburger
              recipe made from lean beef. Skip the prepackaged patties and
              take the extra time to craft up your own, and that little
              extra effort will be worth it.
            </p>
            <div class="recipe-bottom">
              <div class="rec-bot-info">
                <div class="time-pic"></div>
                <div>30 min</div>
              </div>
              <div class="rec-bot-info">
                <div class="servings-pic"></div>
                <div>4 servings</div>
              </div>
            </div>
          </div>
        </div>
        <div class="buttonBin">
          <div class="edit-delete-button" id="edit">Edit Recipe</div>
          <div class="edit-delete-button" id="delete">Delete</div>
        </div>
      </div>
    </div>`;
    return { className: className, content: contentString };
  };

  var _getCreateRecipeContent = function () {
    let contentString = `<h2>Hey, create your recipe!</h2>
    <div class="details-div">
      <div class="input-div">
        <input id='recImage' type="text" placeholder="Add Recipe Image" />
      </div>
      <input id='recName' type="text" placeholder="Recipe Name" />
      <input id='recDescription' type="text" placeholder="Recipe Description" />
      <input id='recTime' type="text" placeholder="Recipe Total Time" />
      <input id='recServings' type="text" placeholder="Recipe Total Servings" />
    </div>

    <div id='ingredients-container' class="details-div">
      <h3>Enter Ingredients:</h3>
      <input class='recIngredients' type="text" placeholder="Ingredient #1" />
      <input class='recIngredients' type="text" placeholder="Ingredient #2" />
      <div class="input-div">
        <input class='recIngredients' type="text" placeholder="Ingredient #3" />
        <div class="add-row-button">+</div>
      </div>
    </div>
    <div id='instructions-container' class="details-div">
      <h3>Enter Instructions:</h3>
      <input class='recInstructions' type="text" placeholder="Instruction #1" />
      <input class='recInstructions' type="text" placeholder="Instruction #2" />
      <div class="input-div">
        <input class='recInstructions' type="text" placeholder="Instruction #3" />
        <div class="add-row-button">+</div>
      </div>
    </div>
    <div id="new" class="submit-recipe-button">Create Recipe</div>`;
    return contentString;
  };

  var _getEditRecipeContent = function () {
    let className = "create-edit-content";
    let contentString = `<h2>Hey, edit your recipe!</h2>
    <div class="details-div">
      <div class="input-icon-div">
        <input type="text" placeholder="Edit Recipe Image" />
        <div class="image-button">Attach file</div>
      </div>
      <input type="text" placeholder="Recipe Name" />
      <input type="text" placeholder="Recipe Description" />
      <input type="text" placeholder="Recipe Total Time" />
      <input type="text" placeholder="Recipe Total Servings" />
    </div>

    <div class="details-div">
      <h3>Edit Ingredients:</h3>
      <input type="text" placeholder="Ingredient #1" />
      <input type="text" placeholder="Ingredient #2" />
      <div class="input-icon-div">
        <input type="text" placeholder="Ingredient #3" />
        <div class="add-row-button">+</div>
      </div>
    </div>
    <div class="details-div">
      <h3>Edit Instructions:</h3>
      <input type="text" placeholder="Instruction #1" />
      <input type="text" placeholder="Instruction #2" />
      <div class="input-icon-div">
        <input type="text" placeholder="Instruction #3" />
        <div class="add-row-button">+</div>
      </div>
    </div>
    <div class="submit-recipe-button">Submit Changes</div>`;
    return { className: className, content: contentString };
  };

  var _getLoginContent = function () {
    let className = "login-content";
    let contentString = `<div class="login-left">
      <h1>Login Here!</h1>

      <input type="email" name="" id="" placeholder="Email Address" />
      <input type="password" name="" id="" placeholder="Password" />
      <div class="login-button">Login</div>
    </div>
    <div class="login-right">
      <p>don't have an account?</p>
      <h1>Sign Up!</h1>
      <input type="text" name="" id="" placeholder="First Name" />
      <input type="text" name="" id="" placeholder="Last Name" />
      <input type="email" name="" id="" placeholder="Email Address" />
      <input type="password" name="" id="" placeholder="Password" />
      <div class="login-button">Sign Up</div>
    </div>`;
    return { className: className, content: contentString };
  };

  return {
    initFirebase: _initFirebase,
    getAllRecipes: _getAllRecipes,
    getRecipeDetails: _getRecipeDetails,
    editRecipe: _editRecipe,
    createRecipe: _createRecipe,
    deleteRecipe: _deleteRecipe,
    getHomeContent: _getHomeContent,
    getBrowseContent: _getBrowseContent,
    getYourRecipesContent: _getYourRecipesContent,
    getCreateRecipeContent: _getCreateRecipeContent,
    getEditRecipeContent: _getEditRecipeContent,
    getLoginContent: _getLoginContent,
  };
})();
