import { createCard } from '../components/Card.js';
import { addItem, checkInSet, cleanItem } from './globals.js';
import {
  defaultEquipmentsSet,
  defaultIngredientsSet,
  defaultRecipesSet,
  defaultToolsSet,
} from './state.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const populateIngredients = async () => {
  const ingredientsContainer = document.querySelector('.select__items--ingredients');

  if (!ingredientsContainer) return;

  fetch('./../recipes.json')
    .then((data) => data.json())
    .then(async (recipes) => {
      for (let recipe of recipes) {
        for (let ingredient of recipe.ingredients) {
          if (checkInSet(defaultIngredientsSet, ingredient.ingredient)) {
            continue;
          }

          defaultIngredientsSet.add(cleanItem(ingredient.ingredient));
          addItem(ingredient.ingredient, ingredientsContainer);
          // await sleep(100);
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
      for (let recipe of recipes) {
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
      for (let recipe of recipes) {
        for (let tool of recipe.ustensils) {
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
      for (let recipe of recipes) {
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
