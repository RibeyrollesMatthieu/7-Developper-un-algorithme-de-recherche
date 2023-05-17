import { updateAdditionalSearch, updateContentDependingOnTags } from './algorithms.js';
import {
  addItem,
  clearContainer,
  equipmentsContainer,
  ingredientsContainer,
  recipesContainer,
  toolsContainer,
} from './globals.js';
import {
  defaultEquipmentsSet,
  defaultIngredientsSet,
  defaultRecipesSet,
  defaultToolsSet,
  getCurrentRecipes,
  getCurrentTags,
  hasUserTypedRecipes,
  setCurrentEquipments,
  setCurrentIngredients,
  setCurrentRecipes,
  setCurrentTools,
  setPreviousUserInputLengthEquipments,
  setPreviousUserInputLengthIngredients,
  setPreviousUserInputLengthRecipes,
  setPreviousUserInputLengthTools,
} from './state.js';

export const reset = (container, defaultSet, isCard = false) => {
  clearContainer(container);
  for (let i = 0; i < defaultSet.size; i += 1) {
    let item = [...defaultSet][i];

    addItem(item, container, isCard);
  }
};
export const resetRecipes = () => {
  if (getCurrentTags().length > 0) {
    updateContentDependingOnTags(false);
    return;
  }
  reset(recipesContainer, defaultRecipesSet, true);
  setCurrentRecipes(defaultRecipesSet);
};
export const resetIngredients = () => {
  if (getCurrentTags().length > 0 || hasUserTypedRecipes()) {
    updateAdditionalSearch(getCurrentRecipes(), true, false, false);
    return;
  }
  reset(ingredientsContainer, defaultIngredientsSet);
  setCurrentIngredients(defaultIngredientsSet);
};
export const resetTools = () => {
  if (getCurrentTags().length > 0 || hasUserTypedRecipes()) {
    updateAdditionalSearch(getCurrentRecipes(), false, true, false);
    return;
  }
  reset(toolsContainer, defaultToolsSet);
  setCurrentTools(defaultToolsSet);
};
export const resetEquipments = () => {
  if (getCurrentTags().length > 0 || hasUserTypedRecipes()) {
    updateAdditionalSearch(getCurrentRecipes(), false, false, true);
    return;
  }
  reset(equipmentsContainer, defaultEquipmentsSet);
  setCurrentEquipments(defaultEquipmentsSet);
};
/**
 * Reset the DOM for the additional search dropdowns
 */
export const resetAdditonalSearchContainers = (
  ingredients = true,
  tools = true,
  equipments = true
) => {
  if (ingredients) resetIngredients();
  if (tools) resetTools();
  if (equipments) resetEquipments();
};

export const resetPreviousUserInputLengthRecipes = () => setPreviousUserInputLengthRecipes(0);
export const resetPreviousUserInputLengthIngredients = () =>
  setPreviousUserInputLengthIngredients(0);
export const resetPreviousUserInputLengthEquipments = () => setPreviousUserInputLengthEquipments(0);
export const resetPreviousUserInputLengthTools = () => setPreviousUserInputLengthTools(0);
