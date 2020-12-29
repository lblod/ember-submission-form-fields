import { helper } from '@ember/component/helper';

export default helper(function componentForDisplayTypeEdit(displayTypeUri) {
  const mapping = {
    'http://lblod.data.gift/display-types/property-group' : 'property-group',
    'http://lblod.data.gift/display-types/defaultInput': `rdf-input-fields/input/edit`,
    'http://lblod.data.gift/display-types/numericalInput': `rdf-input-fields/numerical-input/edit`,
    'http://lblod.data.gift/display-types/dateTime': `rdf-input-fields/date-time/edit`,
    'http://lblod.data.gift/display-types/date': `rdf-input-fields/date/edit`,
    'http://lblod.data.gift/display-types/textArea': `rdf-input-fields/text-area/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `rdf-input-fields/concept-scheme-selector/edit`,
    'http://lblod.data.gift/display-types/files/variation/1': `rdf-input-fields/files/edit`,
    'http://lblod.data.gift/display-types/remoteUrls/variation/1': `rdf-input-fields/remote-urls/edit`,
    'http://lblod.data.gift/display-types/files': `rdf-input-fields/files/edit`,
    'http://lblod.data.gift/display-types/remoteUrls': `custom-submission-form-fields/remote-urls/edit`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `rdf-input-fields/vlabel-opcentiem/edit`,
    'http://lblod.data.gift/display-types/switch': `rdf-input-fields/switch/edit`,
    'http://lblod.data.gift/display-types/checkbox': `rdf-input-fields/checkbox/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelector': `rdf-input-fields/concept-scheme-multi-selector/edit`,
    'http://lblod.data.gift/display-types/dateRange': `rdf-input-fields/date-range/edit`,
    'http://lblod.data.gift/display-types/search': `rdf-input-fields/search/edit`,
    'http://lblod.data.gift/display-types/customSearch': `search-panel-fields/search/edit`,
    'http://lblod.data.gift/display-types/bestuursorgaanSelector': `custom-submission-form-fields/bestuursorgaan-selector/edit`,
    'http://lblod.data.gift/display-types/applicationFormTable': `custom-subsidy-form-fields/application-form-table/edit`
  };

  return mapping[displayTypeUri] || '';
});
