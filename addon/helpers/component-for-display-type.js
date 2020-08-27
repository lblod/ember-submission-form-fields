import { helper } from '@ember/component/helper';
const mapping = {
  edit : {
    'http://lblod.data.gift/display-types/defaultInput': `rdf-input-fields/input/edit`,
    'http://lblod.data.gift/display-types/dateTime': `rdf-input-fields/date-time/edit`,
    'http://lblod.data.gift/display-types/date': `rdf-input-fields/date/edit`,
    'http://lblod.data.gift/display-types/textArea': `rdf-input-fields/text-area/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `rdf-input-fields/concept-scheme-selector/edit`,
    'http://lblod.data.gift/display-types/files': `rdf-input-fields/files/edit`,
    'http://lblod.data.gift/display-types/remoteUrls': `rdf-input-fields/remote-urls/edit`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `rdf-input-fields/vlabel-opcentiem/edit`,
    'http://lblod.data.gift/display-types/switch': `rdf-input-fields/switch/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelector': `rdf-input-fields/concept-scheme-multi-selector/edit`,
    'http://lblod.data.gift/display-types/dateRange': `rdf-input-fields/date-range/edit`,
    'http://lblod.data.gift/display-types/search': `rdf-input-fields/search/edit`,
    'http://lblod.data.gift/display-types/customSearch': `search-panel-fields/search/edit`,
    'http://lblod.data.gift/display-types/bestuursorgaanSelector': `custom-submission-form-fields/bestuursorgaan-selector/edit`,

  },

  show : {
    'http://lblod.data.gift/display-types/defaultInput': `rdf-input-fields/input/show`,
    'http://lblod.data.gift/display-types/textArea': `rdf-input-fields/text-area/show`,
    'http://lblod.data.gift/display-types/date': `rdf-input-fields/date/show`,
    'http://lblod.data.gift/display-types/dateTime': `rdf-input-fields/date-time/show`,
    'http://lblod.data.gift/display-types/files': `rdf-input-fields/files/show`,
    'http://lblod.data.gift/display-types/remoteUrls': `rdf-input-fields/remote-urls/show`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `rdf-input-fields/concept-scheme-selector/show`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `rdf-input-fields/vlabel-opcentiem/show`,
    'http://lblod.data.gift/display-types/switch': `rdf-input-fields/switch/show`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelector': `rdf-input-fields/concept-scheme-multi-selector/show`,
    'http://lblod.data.gift/display-types/dateRange': `rdf-input-fields/date-range/show`,
    'http://lblod.data.gift/display-types/search': `rdf-input-fields/search/show`,
    'http://lblod.data.gift/display-types/customSearch': `search-panel-fields/search/show`,
    'http://lblod.data.gift/display-types/bestuursorgaanSelector': `custom-submission-form-fields/bestuursorgaan-selector/show`,

  }
}

export default helper(function componentForDisplayType([displayType], {show}) {
  let components = mapping.edit;
  if(show) components = mapping.show;
  return components[displayType] || '';
});
