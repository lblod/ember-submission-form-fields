import { helper } from '@ember/component/helper';

export default helper(function componentForDisplayTypeShow(displayTypeUri) {
  const mapping = {
    'http://lblod.data.gift/display-types/defaultInput' : `submission-form/input-fields/input/show`,
    'http://lblod.data.gift/display-types/textArea' : `submission-form/input-fields/text-area/show`,
    'http://lblod.data.gift/display-types/date' : `submission-form/input-fields/date/show`,
    'http://lblod.data.gift/display-types/dateTime' : `submission-form/input-fields/date-time/show`,
    'http://lblod.data.gift/display-types/files' : `submission-form/input-fields/files/show`,
    'http://lblod.data.gift/display-types/remoteUrls' : `submission-form/input-fields/remote-urls/show`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `submission-form/input-fields/concept-scheme-selector/show`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `submission-form/input-fields/vlabel-opcentiem/show`,
    'http://lblod.data.gift/display-types/switch': `submission-form/input-fields/switch/show`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelector': `submission-form/input-fields/concept-scheme-multi-selector/show`,
    'http://lblod.data.gift/display-types/dateRange': `submission-form/input-fields/date-range/edit`
  };

  return mapping[displayTypeUri] || '';
});
