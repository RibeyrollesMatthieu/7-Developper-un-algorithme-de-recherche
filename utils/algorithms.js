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

  // for each matching recipe, we'll update the search+ containers
  for (let recipe of newRecipes) {
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
  for (let recipe of getCurrentRecipes()) {
    switch (category) {
      case 'ingredient': {
        for (let ingredient of recipe.ingredients) {
          // if the recipe has the ingredient, we keep it
          if (matches(ingredient.ingredient, tagValue)) {
            updatedRecipesSet.add(recipe);
          }
        }
        break;
      }
      case 'tool': {
        for (let tool of recipe.ustensils) {
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

export const updateContentDependingOnTags = () => {
  const updatedRecipesSet = new Set();

  /* TODO */
  /**
   * Quand on enlève un tag,
   * on veut parcourir tout
   * pour chaque recette, elle doit match avec la recherche utilisateur et les tags restants
   *
   *
   */

  for (let recipe of getDefaultRecipesSet()) {
    for (let { label, category } of getCurrentTags()) {
      switch (category) {
        case 'ingredient': {
          for (let ingredient of recipe.ingredients) {
            // if the recipe has the ingredient, we keep it
            if (matches(ingredient.ingredient, label)) {
              updatedRecipesSet.add(recipe);
            }
          }
          break;
        }
        case 'tool': {
          for (let tool of recipe.ustensils) {
            // if the recipe has the ustensil, we keep it
            if (matches(tool, label)) {
              updatedRecipesSet.add(recipe);
            }
          }
          break;
        }
        case 'equipment': {
          // if the recipe has the appliance, we keep it
          if (matches(recipe.appliance, label)) {
            updatedRecipesSet.add(recipe);
          }
          break;
        }
        default:
          return;
      }
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
  for (let equipment of getCurrentEquipments(input.length)) {
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
  for (let tool of getCurrentTools(input.length)) {
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
  for (let ingredient of getCurrentIngredients(input.length)) {
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
  for (let recipe of getCurrentRecipes(input.length)) {
    /* we look if any ingredients matches the input */
    for (let ingredient of recipe.ingredients) {
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

  // we update previous user input length w/ new one
  setPreviousUserInputLengthRecipes(input.length);
};
