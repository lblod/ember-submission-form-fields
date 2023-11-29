import { helper } from '@ember/component/helper';
import {
  PROPERTY_GROUP_DISPLAY_TYPE,
  SECTION_DISPLAY_TYPE,
} from '../models/section';

export function isSection([displayType]) {
  return (
    displayType === SECTION_DISPLAY_TYPE ||
    displayType === PROPERTY_GROUP_DISPLAY_TYPE
  );
}

export default helper(isSection);
