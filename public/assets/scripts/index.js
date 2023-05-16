import {
  equipmentsAlgorithm,
  ingredientsAlgorithm,
  recipesAlgorithm,
  toolsAlgorithm,
} from '../../../utils/algorithms.js';

const handleSelectOpen = (e) => {
  const responsesList = e.target.parentElement.nextElementSibling;
  const chevron = e.target.children[0];

  chevron.classList.toggle('fa-chevron-up');
  chevron.classList.toggle('fa-chevron-down');

  responsesList.classList.toggle('visually-hidden');
};

Array.from(document.querySelectorAll('.select__toggle-button')).forEach((button) =>
  button.addEventListener('click', handleSelectOpen)
);

document
  .querySelector('#select__input--ingredients')
  .addEventListener('input', (e) => ingredientsAlgorithm(e.target.value));

document
  .querySelector('#select__input--equipments')
  .addEventListener('input', (e) => equipmentsAlgorithm(e.target.value));

document
  .querySelector('#select__input--tools')
  .addEventListener('input', (e) => toolsAlgorithm(e.target.value));

document
  .querySelector('#recipeSearch')
  .addEventListener('input', (e) => recipesAlgorithm(e.target.value));
