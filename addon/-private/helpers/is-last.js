import { helper } from '@ember/component/helper';

export default helper(function isLast([array, maybeLastItem]) {
  if (!Array.isArray(array)) {
    return false;
  }

  if (array.length >= 1) {
    return array.at(-1) === maybeLastItem;
  }

  return false;
});
