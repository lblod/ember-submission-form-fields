import { helper } from '@ember/component/helper';
import { LISTING_TYPE } from '../models/listing';

export function isListing([formItemType]) {
  return formItemType === LISTING_TYPE;
}

export default helper(isListing);
