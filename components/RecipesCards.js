import { createCard } from './Card.js';

export const createRecipesCards = async () => {
  const container = document.querySelector('.recipes-cards');

  if (!container) return;

  fetch('./../recipes.json')
    .then((data) => data.json())
    .then((recipes) => {
      for (let i = 0; i < recipes.length; i += 1) {
        let recipe = recipes[i];
        const card = createCard(recipe);
        container.appendChild(card);
      }
    });
};
