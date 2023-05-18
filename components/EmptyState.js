export const createEmptyState = (content) => {
  const div = document.createElement('div');
  const text = document.createElement('p');

  text.innerHTML = content;

  div.appendChild(text);
  div.classList.add('empty-state', 'mx-auto', 'mt-3', 'text-white', 'text-center');

  return div;
};
