import { helper } from '@ember/component/helper';

export default helper(function componentForDisplayTypeShow(displayTypeUri) {
  const mapping = {
    'http://lblod.data.gift/display-types/defaultInput' : `ember-submission-form/input-fields/input/show`,
    'http://lblod.data.gift/display-types/textArea' : `ember-submission-form/input-fields/text-area/show`,
    'http://lblod.data.gift/display-types/date' : `ember-submission-form/input-fields/date/show`,
    'http://lblod.data.gift/display-types/dateTime' : `ember-submission-form/input-fields/date-time/show`,
    'http://lblod.data.gift/display-types/files' : `ember-submission-form/input-fields/files/show`,
    'http://lblod.data.gift/display-types/remoteUrls' : `ember-submission-form/input-fields/remote-urls/show`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `ember-submission-form/input-fields/concept-scheme-selector/show`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `ember-submission-form/input-fields/vlabel-opcentiem/show`
  };

  return mapping[displayTypeUri] || '';
});
