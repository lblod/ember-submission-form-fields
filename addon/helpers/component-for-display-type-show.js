import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';

export default helper(function componentForDisplayTypeShow([displayTypeUri]) {
  const mapping = {
    'http://lblod.data.gift/display-types/property-group' : 'property-group',
    'http://lblod.data.gift/display-types/defaultInput': `rdf-input-fields/input/show`,
    'http://lblod.data.gift/display-types/numericalInput': `rdf-input-fields/numerical-input/show`,
    'http://lblod.data.gift/display-types/textArea': `rdf-input-fields/text-area/show`,
    'http://lblod.data.gift/display-types/date': `rdf-input-fields/date/show`,
    'http://lblod.data.gift/display-types/dateTime': `rdf-input-fields/date-time/show`,
    'http://lblod.data.gift/display-types/files/variation/1': `rdf-input-fields/files/show`,
    'http://lblod.data.gift/display-types/remoteUrls/variation/1': `rdf-input-fields/remote-urls/show`,
    'http://lblod.data.gift/display-types/files': `rdf-input-fields/files/show`,
    'http://lblod.data.gift/display-types/remoteUrls': `custom-submission-form-fields/remote-urls/show`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `rdf-input-fields/concept-scheme-selector/show`,
    'http://lblod.data.gift/display-types/vLabelOpcentiem': `rdf-input-fields/vlabel-opcentiem/show`,
    'http://lblod.data.gift/display-types/switch': `rdf-input-fields/switch/show`,
    'http://lblod.data.gift/display-types/checkbox': `rdf-input-fields/checkbox/show`,
    'http://lblod.data.gift/display-types/conceptSchemeRadioButtons': `rdf-input-fields/concept-scheme-radio-buttons/show`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelector': `rdf-input-fields/concept-scheme-multi-selector/show`,
    'http://lblod.data.gift/display-types/dateRange': `rdf-input-fields/date-range/show`,
    'http://lblod.data.gift/display-types/search': `rdf-input-fields/search/show`,
    'http://lblod.data.gift/display-types/customSearch': `search-panel-fields/search/show`,
    'http://lblod.data.gift/display-types/bestuursorgaanSelector': `custom-submission-form-fields/bestuursorgaan-selector/show`,
    'http://lblod.data.gift/display-types/applicationFormTable': `custom-subsidy-form-fields/application-form-table/show`,
    'http://lblod.data.gift/display-types/engagementTable': `custom-subsidy-form-fields/engagement-table/show`,
    'http://lblod.data.gift/display-types/climateSubsidyCostTable': `custom-subsidy-form-fields/climate-subsidy-costs-table/show`,
    'http://lblod.data.gift/display-types/caseNumber': `rdf-input-fields/case-number/show`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelectCheckboxes': `rdf-input-fields/concept-scheme-multi-select-checkboxes/show`,
    'http://lblod.data.gift/display-types/estimatedCostTable': `custom-subsidy-form-fields/estimated-cost-table/show`,
    'http://lblod.data.gift/display-types/objectiveTable': `custom-subsidy-form-fields/objective-table/show`
  };

  assert(
    `"${displayTypeUri}" did not resolve to a component name. Make sure the mapping exists or it doesn't contain any typos.`,
    mapping[displayTypeUri]
  );

  return mapping[displayTypeUri];
});
