/**
 * Generate a card component
 * @param {{ id: number; name: string; servings: number; time: number; desciption: string; appliance: string; ustensils: string[]; ingredients: { ingredient: string; quantity?: number; unit?: string }[] }} content
 * @returns {HTMLDivElement}
 */
export const createCard = (content) => {
  const { name, time, ingredients, description } = content;

  /* card container */
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

    /* card image */
    const cardImage = document.createElement('img');
    cardImage.src = 'https://placehold.co/300x200';
    cardImage.classList.add('card-img-top');

    /* card content container */
    const cardBodyContainer = document.createElement('div');
    cardBodyContainer.classList.add('card-body', 'bg-light');

      /* card header */
      const cardHeader = document.createElement('div');
      cardHeader.classList.add('card-title', 'd-flex', 'justify-content-between', 'mb-3');

        /* card header name */
        const cardHeaderName = document.createElement('h5');
        cardHeaderName.textContent = name || 'Lorem Ipsum';

        /* card header duration */
        const cardHeaderDuration = document.createElement('span');
        cardHeaderDuration.textContent = `${time} min` || '1 sec'
        cardHeaderDuration.classList.add('card-header__duration', 'icon');

      cardHeader.append(cardHeaderName, cardHeaderDuration);

      /* card card body container */
      const cardBodyRecipe = document.createElement('div');
      cardBodyRecipe.classList.add('card-body__recipe');

        /* card body ingredients  */
        const cardBodyRecipeIngredients = document.createElement('ul');
        cardBodyRecipeIngredients.classList.add('card-ingredients');
        const ingredientsList = ingredients || [
          {
            "ingredient" : "Lait de coco",
            "quantity" : 400,
            "unit" : "ml"
          },
          {
              "ingredient" : "Jus de citron",
              "quantity" : 2
          },
          {
              "ingredient" : "Crème de coco",
              "quantity" : 2,
              "unit" : "cuillères à soupe"
          },
          {
              "ingredient" : "Sucre",
              "quantity" : 30,
              "unit" : "grammes"
          },
          {
              "ingredient": "Glaçons"
          }
        ];

        for (let { ingredient, quantity, unit } of ingredientsList) {
          const ingredientElement = document.createElement('li');
          ingredientElement.innerHTML = `${ingredient}: ${quantity || ''} ${unit || ''}`;
          cardBodyRecipeIngredients.append(ingredientElement);
        }

        /* card text */
        const cardBodyRecipeDescription = document.createElement('p');
        cardBodyRecipeDescription.classList.add('card-text');
        cardBodyRecipeDescription.innerText = description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.';

      cardBodyRecipe.append(cardBodyRecipeIngredients, cardBodyRecipeDescription);

    cardBodyContainer.append(cardHeader, cardBodyRecipe);

  card.append(cardImage, cardBodyContainer);

  return card;
}