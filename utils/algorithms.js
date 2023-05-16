import { isPresentInTags } from '../components/Tag.js';
import { cleanItem, matches, udpateRecipesDOM, updateFieldsDOM } from './globals.js';
import {
  resetAdditonalSearchContainers,
  resetPreviousUserInputLengthEquipments,
  resetPreviousUserInputLengthIngredients,
  resetPreviousUserInputLengthRecipes,
  resetPreviousUserInputLengthTools,
  resetRecipes,
} from './reset.js';
import {
  getCurrentEquipments,
  getCurrentIngredients,
  getCurrentRecipes,
  getCurrentTags,
  getCurrentTools,
  getDefaultRecipesSet,
  getPreviousUserInputLengthRecipes,
  getPreviousUserInputRecipes,
  hasUserTypedEquipments,
  hasUserTypedIngredients,
  hasUserTypedRecipes,
  hasUserTypedTools,
  setCurrentEquipments,
  setCurrentIngredients,
  setCurrentRecipes,
  setCurrentTools,
  setPreviousUserInputLengthEquipments,
  setPreviousUserInputLengthIngredients,
  setPreviousUserInputLengthRecipes,
  setPreviousUserInputLengthTools,
  setPreviousUserInputRecipes,
  setUserTypedEquipments,
  setUserTypedIngredients,
  setUserTypedRecipes,
  setUserTypedTools,
} from './state.js';

/**
 * Update the additional search dropdowns with the data from the newRecipes Set
 * @param {Set} newRecipes
 */
export const updateAdditionalSearch = (
  newRecipes,
  updateIngredients = true,
  updateTools = true,
  updateEquipments = true
) => {
  const updatedIngredientsSet = new Set();
  const updatedEquipmentsSet = new Set();
  const updatedToolsSet = new Set();

  for (let i = 0; i < newRecipes.size; i += 1) {
    /* could use iterator as well here. see https://stackoverflow.com/questions/32539354/how-to-get-the-first-element-of-set-in-es6-ecmascript-2015 */
    let recipe = [...newRecipes][i];

    /* update ingredients */
    if (updateIngredients) {
      for (let ingredient of recipe.ingredients) {
        if (!isPresentInTags(cleanItem(ingredient.ingredient), 'ingredient')) {
          updatedIngredientsSet.add(cleanItem(ingredient.ingredient));
        }
      }
    }

    /* update tools */
    if (updateTools) {
      for (let tool of recipe.ustensils) {
        if (!isPresentInTags(cleanItem(tool), 'tool')) {
          updatedToolsSet.add(cleanItem(tool));
        }
      }
    }

    /* updates equipments */
    if (updateEquipments) {
      if (!isPresentInTags(cleanItem(recipe.appliance), 'equipment')) {
        updatedEquipmentsSet.add(cleanItem(recipe.appliance));
      }
    }
  }

  // we update the DOM
  updateFieldsDOM(
    updateIngredients ? updatedIngredientsSet : undefined,
    updateTools ? updatedToolsSet : undefined,
    updateEquipments ? updatedEquipmentsSet : undefined
  );

  // finally, we update the current sets
  if (updateIngredients) setCurrentIngredients(updatedIngredientsSet);
  if (updateEquipments) setCurrentEquipments(updatedEquipmentsSet);
  if (updateTools) setCurrentTools(updatedToolsSet);
};

/**
 * Update the current recipes depending on the selected tag
 * @param {'ingredient' | 'tool' | 'equipment'} category
 * @param {string} tagValue
 */
export const updateRecipesWithTags = (category, tagValue) => {
  const updatedRecipesSet = new Set();

  // for each recipe in our current recipes, we'll keep the recipes matching the tag
  for (let i = 0; i < getCurrentRecipes().size; i += 1) {
    let recipe = [...getCurrentRecipes()][i];

    switch (category) {
      case 'ingredient': {
        for (let j = 0; j < recipe.ingredients.length; j += 1) {
          let ingredient = recipe.ingredients[j];
          // if the recipe has the ingredient, we keep it
          if (matches(ingredient.ingredient, tagValue)) {
            updatedRecipesSet.add(recipe);
          }
        }
        break;
      }
      case 'tool': {
        for (let j = 0; j < recipe.ustensils.length; j += 1) {
          let tool = recipe.ustensils[j];
          // if the recipe has the ustensil, we keep it
          if (matches(tool, tagValue)) {
            updatedRecipesSet.add(recipe);
          }
        }
        break;
      }
      case 'equipment': {
        // if the recipe has the appliance, we keep it
        if (matches(recipe.appliance, tagValue)) {
          updatedRecipesSet.add(recipe);
        }
        break;
      }
      default:
        return;
    }
  }

  /* now we update the DOM with the recipes we kept */
  udpateRecipesDOM(updatedRecipesSet);

  /* finally, we update the current recipes */
  setCurrentRecipes(updatedRecipesSet);

  updateAdditionalSearch(updatedRecipesSet);
};

export const getDefaultRecipesMatchingTags = () => {
  let updatedRecipesSet = new Set();

  if (getCurrentTags().length > 0) {
    for (let i = 0; i < getDefaultRecipesSet().size; i += 1) {
      let recipe = [...getDefaultRecipesSet()][i];
      let isAddable = false; /* addable if all tags match recipe */

      /* we look for applied tags */

      let tagsMatching = 0;
      for (let j = 0; j < getCurrentTags().length; j += 1) {
        let { label, category } = getCurrentTags()[j];

        switch (category) {
          case 'ingredient': {
            for (let k = 0; k < recipe.ingredients.length; k += 1) {
              let ingredient = recipe.ingredients[k];
              // if the tag and the recipe doesn't match, we remove the recipe
              if (matches(ingredient.ingredient, label)) {
                tagsMatching += 1;
              }
            }
            break;
          }
          case 'tool': {
            for (let k = 0; k < recipe.ustensils; k += 1) {
              let tool = recipe.ustensils[k];
              if (matches(tool, label)) {
                tagsMatching += 1;
              }
            }
            break;
          }
          case 'equipment': {
            if (matches(recipe.appliance, label)) {
              tagsMatching += 1;
            }
            break;
          }
          default:
            return;
        }
      }

      if (tagsMatching === getCurrentTags().length) {
        updatedRecipesSet.add(recipe);
      }
    }
  } else {
    updatedRecipesSet = getDefaultRecipesSet();
  }

  return updatedRecipesSet;
};

export const updateContentDependingOnTags = (
  filterOnUserInput = getPreviousUserInputLengthRecipes() !== 0
) => {
  let updatedRecipesSet = new Set();
  const input = getPreviousUserInputRecipes();

  updatedRecipesSet = getDefaultRecipesMatchingTags();

  if (filterOnUserInput) {
    for (let i = 0; i < updatedRecipesSet.size; i += 1) {
      let recipe = [...updatedRecipesSet][i];
      /* we look if any ingredients matches the input */
      let isIn = false;

      for (let j = 0; j < recipe.ingredients.length; j += 1) {
        let ingredient = recipe.ingredients[j];
        if (matches(ingredient.ingredient, input)) isIn = true;
      }

      // otherwise, we look in the name and description for a match
      if (matches(recipe.name, input) || matches(recipe.description, input)) isIn = true;

      if (!isIn) updatedRecipesSet.delete(recipe);
    }
  }

  /* now we update the DOM with the recipes we kept */
  udpateRecipesDOM(updatedRecipesSet);

  /* finally, we update the current recipes */
  setCurrentRecipes(updatedRecipesSet);

  updateAdditionalSearch(updatedRecipesSet);
};

export const equipmentsAlgorithm = async (input) => {
  if (input.length < 3) {
    // if the user already typed, we reset everything, cause that means he's emptying the input
    if (hasUserTypedEquipments()) {
      setUserTypedEquipments(false);
      resetAdditonalSearchContainers(false, false, true);
      resetPreviousUserInputLengthEquipments();
    }

    return;
  }

  // we remember the user started typing
  setUserTypedEquipments(true);
  const updatedEquipmentsSet = new Set();

  // we look for matching ingredients
  for (let i = 0; i < getCurrentEquipments(input.length).size; i += 1) {
    let equipment = [...getCurrentEquipments(input.length)][i];
    if (matches(equipment, input)) updatedEquipmentsSet.add(equipment);
  }

  // we update the DOM for this field only
  updateFieldsDOM(null, null, updatedEquipmentsSet);

  // we update the current recipes
  setCurrentEquipments(updatedEquipmentsSet);

  setPreviousUserInputLengthEquipments(input.length);
};

export const toolsAlgorithm = async (input) => {
  if (input.length < 3) {
    // if the user already typed, we reset everything, cause that means he's emptying the input
    if (hasUserTypedTools()) {
      setUserTypedTools(false);
      resetAdditonalSearchContainers(false, true, false);
      resetPreviousUserInputLengthTools();
    }

    return;
  }

  // we remember the user started typing
  setUserTypedTools(true);
  const updatedToolsSet = new Set();

  // we look for matching ingredients
  for (let i = 0; i < getCurrentTools(input.length).size; i += 1) {
    let tool = [...getCurrentTools(input.length)][i];
    if (matches(tool, input)) updatedToolsSet.add(tool);
  }

  // we update the DOM for this field only
  updateFieldsDOM(null, updatedToolsSet, null);

  // we update the current recipes
  setCurrentTools(updatedToolsSet);

  setPreviousUserInputLengthTools(input.length);
};

export const ingredientsAlgorithm = async (input) => {
  if (input.length < 3) {
    // if the user already typed, we reset everything, cause that means he's emptying the input
    if (hasUserTypedIngredients()) {
      setUserTypedIngredients(false);
      resetAdditonalSearchContainers(true, false, false);
      resetPreviousUserInputLengthIngredients();
    }

    return;
  }

  // we remember the user started typing
  setUserTypedIngredients(true);
  const updatedIngredientsSet = new Set();

  // we look for matching ingredients
  for (let i = 0; i < getCurrentIngredients(input.length).size; i += 1) {
    let ingredient = [...getCurrentIngredients(input.length)][i];
    if (matches(ingredient, input)) updatedIngredientsSet.add(ingredient);
  }

  // we update the DOM for this field only
  updateFieldsDOM(updatedIngredientsSet, null, null);

  // we update the current recipes
  setCurrentIngredients(updatedIngredientsSet);

  // we update previous user input length w/ new one
  setPreviousUserInputLengthIngredients(input.length);
};

/**
 *
 * @param {string} input The user input
 */
export const recipesAlgorithm = async (input) => {
  if (input.length < 3) {
    // if the user already typed, we reset everything, cause that means he's emptying the input
    if (hasUserTypedRecipes()) {
      setUserTypedEquipments(false);
      resetRecipes();
      resetAdditonalSearchContainers();
      resetPreviousUserInputLengthRecipes();
    }

    // otherwise, we do nothing cause we don't trigger a search for less than 3 characters
    return;
  }

  // we remember the user started typing
  setUserTypedRecipes(true);
  const updatedRecipesSet = new Set();

  // we look for matching recipes
  for (let i = 0; i < getCurrentRecipes(input.length).size; i += 1) {
    let recipe = [...getCurrentRecipes(input.length)][i];
    /* we look if any ingredients matches the input */
    for (let j = 0; j < recipe.ingredients.length; j += 1) {
      let ingredient = recipe.ingredients[j];
      if (matches(ingredient.ingredient, input)) updatedRecipesSet.add(recipe);
      break;
    }

    // otherwise, we look in the name and description for a match
    if (matches(recipe.name, input) || matches(recipe.description, input))
      updatedRecipesSet.add(recipe);
  }

  updateAdditionalSearch(updatedRecipesSet);

  // now we update the DOM
  udpateRecipesDOM(updatedRecipesSet);

  // we update the current recipes
  setCurrentRecipes(updatedRecipesSet);

  setPreviousUserInputRecipes(input);
  setPreviousUserInputLengthRecipes(input.length);
};
