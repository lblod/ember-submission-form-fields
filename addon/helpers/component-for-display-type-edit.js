import { helper } from '@ember/component/helper';

export default helper(function componentForDisplayTypeEdit(displayTypeUri) {
  const mapping = {
    'http://lblod.data.gift/display-types/defaultInput' : `ember-submission-form/input-fields/input/edit`,
    'http://lblod.data.gift/display-types/dateTime' : `ember-submission-form/input-fields/date-time/edit`,
    'http://lblod.data.gift/display-types/date' : `ember-submission-form/input-fields/date/edit`,
    'http://lblod.data.gift/display-types/textArea': `ember-submission-form/input-fields/text-area/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `ember-submission-form/input-fields/concept-scheme-selector/edit`,
    'http://lblod.data.gift/display-types/files': `ember-submission-form/input-fields/files/edit`,
    'http://lblod.data.gift/display-types/remoteUrls': `ember-submission-form/input-fields/remote-urls/edit`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `ember-submission-form/input-fields/vlabel-opcentiem/edit`
  };

  return mapping[displayTypeUri] || '';
});
