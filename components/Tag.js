import { updateRecipesWithTags } from '../utils/algorithms.js';
import { matches } from '../utils/globals.js';
import { addCurrentTag, getCurrentTags, removeCurrentTag } from '../utils/state.js';

export const createTag = (content, btnClass) => {
  const tag = document.createElement('button');
  tag.setAttribute('type', 'button');
  tag.classList.add('btn', 'position-relative', btnClass);
  tag.innerText = content;

  const badge = document.createElement('span');
  badge.classList.add('badge', 'bg-none');

  const cross = document.createElement('span');
  cross.classList.add('fa', 'fa-sharp', 'fa-regular', 'fa-circle-xmark', 'fs-7');
  tag.addEventListener('click', (e) => {
    tag.remove();
    removeCurrentTag(content);
  });

  badge.append(cross);
  tag.append(badge);

  return tag;
};

export const addTag = (label, btnClass, category) => {
  document.querySelector('.tags').appendChild(createTag(label, btnClass));
  addCurrentTag(label, category);
  updateRecipesWithTags(category, label);
};

export const getTagIndex = (label) => {
  let index = -1;

  for (let i = 0; i < getCurrentTags().length; i += 1) {
    let tag = getCurrentTags()[i];

    if (matches(tag.label, label)) {
      index = i;
    }
  }

  return index;
};

export const isPresentInTags = (label, category = undefined) => {
  let isPresent = false;

  for (let i = 0; i < getCurrentTags().length; i += 1) {
    let tag = getCurrentTags()[i];

    if (matches(tag.label, label)) {
      if (!category || (category && matches(tag.category, category))) {
        isPresent = true;
      }
    }
  }

  return isPresent;
};
