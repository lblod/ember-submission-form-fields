import { helper } from '@ember/component/helper';

export function isPropertyGroup([displayType]) {
  return displayType === 'http://lblod.data.gift/display-types/property-group';
}

export default helper(isPropertyGroup);
