import { createCard } from "./Card.js";

export const createRecipesCards = async () => {
  const container = document.querySelector('.recipes-cards');

  if (!container) return;

  fetch('./../recipes.json')
    .then(data => data.json())
    .then(recipes => {
      for (let recipe of recipes) {
        const card = createCard(recipe);
        container.appendChild(card);
     }
    });
}