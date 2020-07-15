import { helper } from '@ember/component/helper';

export default helper(function componentForDisplayTypeEdit(displayTypeUri) {
  const mapping = {
    'http://lblod.data.gift/display-types/defaultInput': `input-fields/input/edit`,
    'http://lblod.data.gift/display-types/dateTime': `input-fields/date-time/edit`,
    'http://lblod.data.gift/display-types/date': `input-fields/date/edit`,
    'http://lblod.data.gift/display-types/textArea': `input-fields/text-area/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `/input-fields/concept-scheme-selector/edit`,
    'http://lblod.data.gift/display-types/files': `input-fields/files/edit`,
    'http://lblod.data.gift/display-types/remoteUrls': `input-fields/remote-urls/edit`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `input-fields/vlabel-opcentiem/edit`,
    'http://lblod.data.gift/display-types/switch': `input-fields/switch/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelector': `input-fields/concept-scheme-multi-selector/edit`,
    'http://lblod.data.gift/display-types/dateRange': `input-fields/date-range/edit`,
  };

  return mapping[displayTypeUri] || '';
});
