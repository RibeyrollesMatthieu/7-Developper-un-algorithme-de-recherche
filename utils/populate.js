import { createCard } from '../components/Card.js';
import { addItem, checkInSet, cleanItem } from './globals.js';
import {
  defaultEquipmentsSet,
  defaultIngredientsSet,
  defaultRecipesSet,
  defaultToolsSet,
} from './state.js';

export const populateIngredients = async () => {
  const ingredientsContainer = document.querySelector('.select__items--ingredients');

  if (!ingredientsContainer) return;

  fetch('./../recipes.json')
    .then((data) => data.json())
    .then(async (recipes) => {
      for (let i = 0; i < recipes.length; i += 1) {
        let recipe = recipes[i];

        for (let j = 0; j < recipe.ingredients.length; j += 1) {
          let ingredient = recipe.ingredients[j];
          if (checkInSet(defaultIngredientsSet, ingredient.ingredient)) {
            continue;
          }

          defaultIngredientsSet.add(cleanItem(ingredient.ingredient));
          addItem(ingredient.ingredient, ingredientsContainer);
        }
      }
    });
};

export const populateEquipments = async () => {
  const equipmentsContainer = document.querySelector('.select__items--equipments');

  if (!equipmentsContainer) return;

  fetch('./../recipes.json')
    .then((data) => data.json())
    .then(async (recipes) => {
      for (let i = 0; i < recipes.length; i += 1) {
        let recipe = recipes[i];

        if (checkInSet(defaultEquipmentsSet, recipe.appliance)) {
          continue;
        }

        defaultEquipmentsSet.add(cleanItem(recipe.appliance));
        addItem(recipe.appliance, equipmentsContainer);
        // await sleep(100);
      }
    });
};

export const populateTools = async () => {
  const toolsContainer = document.querySelector('.select__items--tools');

  if (!toolsContainer) return;

  fetch('./../recipes.json')
    .then((data) => data.json())
    .then(async (recipes) => {
      for (let i = 0; i < recipes.length; i += 1) {
        let recipe = recipes[i];

        for (let j = 0; j < recipe.ustensils.length; j += 1) {
          let tool = recipe.ustensils[j];
          if (checkInSet(defaultToolsSet, tool, true)) {
            continue;
          }

          defaultToolsSet.add(cleanItem(tool));
          addItem(tool, toolsContainer);
          // await sleep(100);
        }
      }
    });
};

export const populateRecipesCards = async () => {
  const container = document.querySelector('.recipes-cards');

  if (!container) return;

  fetch('./../recipes.json')
    .then((data) => data.json())
    .then((recipes) => {
      for (let i = 0; i < recipes.length; i += 1) {
        let recipe = recipes[i];

        if (checkInSet(defaultRecipesSet, recipe, true)) {
          continue;
        }
        defaultRecipesSet.add(recipe);
        const card = createCard(recipe);
        container.appendChild(card);
      }
    });
};

export const populate = async () => {
  populateIngredients();
  populateEquipments();
  populateTools();
  populateRecipesCards();
};
