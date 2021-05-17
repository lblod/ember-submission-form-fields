import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';

export default helper(function componentForDisplayTypeEdit([displayTypeUri]) {
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
    'http://lblod.data.gift/display-types/conceptSchemeRadioButtons': `rdf-input-fields/concept-scheme-radio-buttons/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelector': `rdf-input-fields/concept-scheme-multi-selector/edit`,
    'http://lblod.data.gift/display-types/dateRange': `rdf-input-fields/date-range/edit`,
    'http://lblod.data.gift/display-types/search': `rdf-input-fields/search/edit`,
    'http://lblod.data.gift/display-types/customSearch': `search-panel-fields/search/edit`,
    'http://lblod.data.gift/display-types/bestuursorgaanSelector': `custom-submission-form-fields/bestuursorgaan-selector/edit`,
    'http://lblod.data.gift/display-types/applicationFormTable': `custom-subsidy-form-fields/application-form-table/edit`,
    'http://lblod.data.gift/display-types/engagementTable': `custom-subsidy-form-fields/engagement-table/edit`,
    'http://lblod.data.gift/display-types/climateSubsidyCostTable': `custom-subsidy-form-fields/climate-subsidy-costs-table/edit`,
    'http://lblod.data.gift/display-types/caseNumber': `rdf-input-fields/case-number/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelectCheckboxes': `rdf-input-fields/concept-scheme-multi-select-checkboxes/edit`,
    'http://lblod.data.gift/display-types/estimatedCostTable': `custom-subsidy-form-fields/estimated-cost-table/edit`,
    'http://lblod.data.gift/display-types/objectiveTable': `custom-subsidy-form-fields/objective-table/edit`
  };

  assert(
    `"${displayTypeUri}" did not resolve to a component name. Make sure the mapping exists or it doesn't contain any typos.`,
    mapping[displayTypeUri]
  );

  return mapping[displayTypeUri];
});
