import { helper } from '@ember/component/helper';

export default helper(function componentForDisplayTypeShow(displayTypeUri) {
  const mapping = {
    'http://lblod.data.gift/display-types/defaultInput' : `input-fields/input/show`,
    'http://lblod.data.gift/display-types/textArea' : `input-fields/text-area/show`,
    'http://lblod.data.gift/display-types/typeDossierSelect': `input-fields/type-dossier-select/show`,
    'http://lblod.data.gift/display-types/date' : `input-fields/date/show`,
    'http://lblod.data.gift/display-types/dateTime' : `input-fields/date-time/show`,
    'http://lblod.data.gift/display-types/files' : `input-fields/files/show`,
    'http://lblod.data.gift/display-types/remoteUrls' : `input-fields/remote-urls/show`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `input-fields/concept-scheme-selector/show`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `input-fields/vlabel-opcentiem/show`
  };

  return mapping[displayTypeUri] || '';
});
