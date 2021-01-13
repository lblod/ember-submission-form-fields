import { helper } from '@ember/component/helper';
import { PROPERTY_GROUP_DISPLAY_TYPE } from '../models/property-group';

export function isPropertyGroup([displayType]) {
  return displayType === PROPERTY_GROUP_DISPLAY_TYPE;
}

export default helper(isPropertyGroup);
