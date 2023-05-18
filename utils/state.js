import { getTagIndex, isPresentInTags } from '../components/Tag.js';
import {
  getDefaultRecipesMatchingTags,
  updateAdditionalSearch,
  updateContentDependingOnTags,
} from './algorithms.js';

export const defaultIngredientsSet = new Set();
export const defaultEquipmentsSet = new Set();
export const defaultToolsSet = new Set();
export const defaultRecipesSet = new Set();

let currentIngredients = defaultIngredientsSet;
let currentEquipments = defaultEquipmentsSet;
let currentTools = defaultToolsSet;
let currentRecipes = defaultRecipesSet;

let emptyStateDisplayed = false;

let ingredientsInputTyped = false;
let equipmentsInputTyped = false;
let toolsInputTyped = false;
let recipesInputTyped = false;

let previousUserInputRecipes = '';
let previousUserInputLengthRecipes = 0;
let previousUserInputLengthIngredients = 0;
let previousUserInputLengthEquipments = 0;
let previousUserInputLengthTools = 0;

let currentTags = [];

// getters
export const getCurrentRecipes = (userInputLength) => {
  /* if we keep typing more letters, we only need to look in recipes that already matched previous input */
  if (!userInputLength || userInputLength > getPreviousUserInputLengthRecipes()) {
    return currentRecipes;
  }

  return getDefaultRecipesMatchingTags();
};
export const getCurrentIngredients = (userInputLength) => {
  if (userInputLength > getPreviousUserInputLengthIngredients()) {
    return currentIngredients;
  }

  if (getCurrentTags().length > 0 || hasUserTypedRecipes()) {
    updateAdditionalSearch(getCurrentRecipes(), true, false, false);
    return currentIngredients;
  }

  return defaultIngredientsSet;
};
export const getDefaultRecipesSet = () => structuredClone(defaultRecipesSet);

export const getCurrentTools = (userInputLength) => {
  if (userInputLength > getPreviousUserInputLengthTools()) {
    return currentTools;
  }

  if (getCurrentTags().length > 0 || hasUserTypedRecipes()) {
    updateAdditionalSearch(getCurrentRecipes(), false, true, false);
    return currentTools;
  }

  return defaultToolsSet;
};
export const getCurrentEquipments = (userInputLength) => {
  if (userInputLength > getPreviousUserInputLengthEquipments()) {
    return currentEquipments;
  }

  if (getCurrentTags().length > 0 || hasUserTypedRecipes()) {
    updateAdditionalSearch(getCurrentRecipes(), false, false, true);
    return currentEquipments;
  }

  return defaultEquipmentsSet;
};

export const hasUserTypedRecipes = () => recipesInputTyped;
export const hasUserTypedIngredients = () => ingredientsInputTyped;
export const hasUserTypedTools = () => toolsInputTyped;
export const hasUserTypedEquipments = () => equipmentsInputTyped;

export const getCurrentTags = () => currentTags;
export const getPreviousUserInputRecipes = () => previousUserInputRecipes;
export const getPreviousUserInputLengthRecipes = () => previousUserInputLengthRecipes;
export const getPreviousUserInputLengthIngredients = () => previousUserInputLengthIngredients;
export const getPreviousUserInputLengthEquipments = () => previousUserInputLengthEquipments;
export const getPreviousUserInputLengthTools = () => previousUserInputLengthTools;

export const isEmptyStateDisplayed = () => emptyStateDisplayed;

// setters
export const setCurrentRecipes = (newRecipes) => (currentRecipes = newRecipes);
export const setPreviousUserInputRecipes = (newInput) => (previousUserInputRecipes = newInput);
export const setCurrentIngredients = (newIngredients) => (currentIngredients = newIngredients);
export const setCurrentTools = (newTools) => (currentTools = newTools);
export const setCurrentEquipments = (newEquipments) => (currentEquipments = newEquipments);

export const setUserTypedRecipes = (value) => (recipesInputTyped = value);
export const setUserTypedIngredients = (value) => (ingredientsInputTyped = value);
export const setUserTypedTools = (value) => (toolsInputTyped = value);
export const setUserTypedEquipments = (value) => (equipmentsInputTyped = value);

export const setIsEmptyStateDisplayed = (displayed) => (emptyStateDisplayed = displayed);

export const setCurrentTags = (newTags) => (currentTags = [...newTags]);
export const setPreviousUserInputLengthRecipes = (newValue) => {
  previousUserInputLengthRecipes = newValue;
};
export const setPreviousUserInputLengthEquipments = (newValue) => {
  previousUserInputLengthEquipments = newValue;
};
export const setPreviousUserInputLengthTools = (newValue) => {
  previousUserInputLengthTools = newValue;
};
export const setPreviousUserInputLengthIngredients = (newValue) => {
  previousUserInputLengthIngredients = newValue;
};

// extras
export const addCurrentTag = (label, category) => currentTags.push({ label, category });
export const removeCurrentTag = (label) => {
  if (!isPresentInTags(label)) return;
  currentTags.splice(getTagIndex(label), 1);
  updateContentDependingOnTags();
};
