import { helper } from '@ember/component/helper';
import {
  PROPERTY_GROUP_DISPLAY_TYPE,
  SECTION_DISPLAY_TYPE,
} from '../models/section';

/**
 * @deprecated use isSection instead
 */
export function isPropertyGroup([displayType]) {
  return (
    displayType === SECTION_DISPLAY_TYPE ||
    displayType === PROPERTY_GROUP_DISPLAY_TYPE
  );
}

export default helper(isPropertyGroup);
