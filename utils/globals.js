import { createCard } from '../components/Card.js';
import { addTag, isPresentInTags } from '../components/Tag.js';

export const ingredientsContainer = document.querySelector('.select__items--ingredients');
export const equipmentsContainer = document.querySelector('.select__items--equipments');
export const toolsContainer = document.querySelector('.select__items--tools');
export const recipesContainer = document.querySelector('.recipes-cards');

export const cleanItem = (item) => item.toLowerCase().trim();
export const matches = (item, match) => cleanItem(item).includes(cleanItem(match));
export const exactMatch = (item, match) => cleanItem(item) === cleanItem(match);

export const clearContainer = (container) => container.replaceChildren();
export const addItem = (item, container, isCard = false) => {
  if (isCard) {
    container.appendChild(createCard(item));
    return;
  }
  const tag = document.createElement('li');
  tag.innerHTML = item;
  tag.addEventListener('click', (e) => {
    const content = e.target.innerHTML;

    if (!isPresentInTags(content)) {
      let tagClass = '';

      let parentClasslistArrayed = [...tag.offsetParent.classList];

      for (let i = 0; i < parentClasslistArrayed.length; i += 1) {
        let _class = parentClasslistArrayed[i];
        if (_class.includes('btn-')) tagClass = _class;
      }

      let category = '';
      if (container.className?.includes('equipment')) category = 'equipment';
      else if (container.className?.includes('tool')) category = 'tool';
      else if (container.className?.includes('ingredient')) category = 'ingredient';

      addTag(content, tagClass, category);
    }
  });
  container.appendChild(tag);
};
// prettier-ignore
export const checkInSet = (set, item, isCard = false) => isCard ? set.has(item) : set.has(cleanItem(item));

/**
 * Update the recipes DOM container
 * @param {Set} newRecipes the recipes to display
 */
export const udpateRecipesDOM = (newRecipes) => {
  clearContainer(recipesContainer);

  let newRecipesArrayed = [...newRecipes];

  for (let i = 0; i < newRecipes.size; i += 1) {
    let recipe = newRecipesArrayed[i];
    addItem(recipe, recipesContainer, true);
  }
};

/**
 * Update the recipes DOM container
 * @param {Set} newIngredients the ingredients to display
 * @param {Set} newTools the tools to display
 * @param {Set} newEquipments the equipments to display
 */
export const updateFieldsDOM = (newIngredients, newTools, newEquipments) => {
  if (newIngredients) {
    clearContainer(ingredientsContainer);

    let newIngredientsArrayed = [...newIngredients];

    for (let i = 0; i < newIngredients.size; i += 1) {
      let ingredient = newIngredientsArrayed[i];
      addItem(ingredient, ingredientsContainer);
    }
  }

  if (newTools) {
    clearContainer(toolsContainer);

    let newToolsArrayed = [...newTools];

    for (let i = 0; i < newTools.size; i += 1) {
      let tool = newToolsArrayed[i];
      addItem(tool, toolsContainer);
    }
  }

  if (newEquipments) {
    clearContainer(equipmentsContainer);

    let newEquipmentsArrayed = [...newEquipments];

    for (let i = 0; i < newEquipments.size; i += 1) {
      let equipment = newEquipmentsArrayed[i];
      addItem(equipment, equipmentsContainer);
    }
  }
};
