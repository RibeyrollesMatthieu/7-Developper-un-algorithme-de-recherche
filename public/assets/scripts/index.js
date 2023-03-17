import { createRecipesCards } from '../../../components/RecipesCards.js';

createRecipesCards();

const handleSelectOpen = (e) => {
  const responsesList = e.target.parentElement.nextElementSibling;
  const chevron = e.target.children[0];

  chevron.classList.toggle('fa-chevron-up');
  chevron.classList.toggle('fa-chevron-down');

  console.log(responsesList);
  responsesList.classList.toggle('visually-hidden');
};

Array.from(document.querySelectorAll('.select__toggle-button')).forEach((button) =>
  button.addEventListener('click', handleSelectOpen)
);
