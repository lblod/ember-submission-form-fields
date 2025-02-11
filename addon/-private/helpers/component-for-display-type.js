import { helper } from '@ember/component/helper';
import { getComponentForDisplayType } from '../../utils/display-type';

export default helper(function componentForDisplayType(
  [displayType],
  { show },
) {
  return getComponentForDisplayType(displayType, show);
});
