/**
 * create a tag
 * @param {string} content
 * @param {'ingredients' | 'equipments' | 'tools' } category
 * @returns {HTMLButtonElement} the tag element
 */
export const createTag = (content, category) => {

  const tag = document.createElement('button');
  tag.setAttribute('type', 'button');
  tag.classList.add('btn', 'btn-primary', 'position-relative');
  tag.innerText = content;

  const badge = document.createElement('span');
  badge.classList.add('badge', 'bg-none');

  const cross = document.createElement('span');
  cross.classList.add('fa', 'fa-sharp', 'fa-regular', 'fa-circle-xmark', 'fs-7');

  badge.append(cross);
  tag.append(badge);

  return badge;
}