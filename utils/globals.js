import { createCard } from '../components/Card.js';
import { createEmptyState } from '../components/EmptyState.js';
import { addTag, isPresentInTags } from '../components/Tag.js';
import { getCurrentTags, isEmptyStateDisplayed, setIsEmptyStateDisplayed } from './state.js';

export const ingredientsContainer = document.querySelector('.select__items--ingredients');
export const equipmentsContainer = document.querySelector('.select__items--equipments');
export const toolsContainer = document.querySelector('.select__items--tools');
export const recipesContainer = document.querySelector('.recipes-cards');

export const cleanItem = (item) => item.toLowerCase().trim();
export const matches = (item, match) => cleanItem(item).includes(cleanItem(match));

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
      const tagClass = [...tag.offsetParent.classList].filter((_class) =>
        _class.includes('btn-')
      )[0];

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

  if (newRecipes.size === 0 && !isEmptyStateDisplayed()) {
    console.log('empty stated');
    document
      .querySelector('main')
      .appendChild(
        createEmptyState(
          'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.'
        )
      );

    setIsEmptyStateDisplayed(true);
    return;
  }

  console.log('not empty');
  document.querySelector('.empty-state')?.remove();
  // setIsEmptyStateDisplayed(false);

  for (let recipe of newRecipes) {
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
    for (let ingredient of newIngredients) addItem(ingredient, ingredientsContainer);
  }

  if (newTools) {
    clearContainer(toolsContainer);
    for (let tool of newTools) addItem(tool, toolsContainer);
  }

  if (newEquipments) {
    clearContainer(equipmentsContainer);
    for (let equipment of newEquipments) addItem(equipment, equipmentsContainer);
  }
};
