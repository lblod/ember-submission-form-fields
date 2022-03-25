import { helper } from '@ember/component/helper';
import { getComponentForDisplayType } from '@lblod/ember-submission-form-fields/utils/display-type';

export default helper(function componentForDisplayType(
  [displayType],
  { show }
) {
  return getComponentForDisplayType(displayType, show);
});
