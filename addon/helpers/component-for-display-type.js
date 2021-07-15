import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';

const mapping = {
  edit : {
    'http://lblod.data.gift/display-types/defaultInput': `rdf-input-fields/input/edit`,
    'http://lblod.data.gift/display-types/numericalInput': `rdf-input-fields/numerical-input/edit`,
    'http://lblod.data.gift/display-types/dateTime': `rdf-input-fields/date-time/edit`,
    'http://lblod.data.gift/display-types/date': `rdf-input-fields/date/edit`,
    'http://lblod.data.gift/display-types/textArea': `rdf-input-fields/text-area/edit`,
    'http://lblod.data.gift/display-types/conceptSchemeSelector': `rdf-input-fields/concept-scheme-selector/edit`,
    'http://lblod.data.gift/display-types/files': `rdf-input-fields/files/edit`,
    'http://lblod.data.gift/display-types/remoteUrls': `rdf-input-fields/remote-urls/edit`,
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
  },

  show : {
    'http://lblod.data.gift/display-types/defaultInput': `rdf-input-fields/input/show`,
    'http://lblod.data.gift/display-types/numericalInput': `rdf-input-fields/numerical-input/show`,
    'http://lblod.data.gift/display-types/textArea': `rdf-input-fields/text-area/show`,
    'http://lblod.data.gift/display-types/date': `rdf-input-fields/date/show`,
    'http://lblod.data.gift/display-types/dateTime': `rdf-input-fields/date-time/show`,
    'http://lblod.data.gift/display-types/files': `rdf-input-fields/files/show`,
    'http://lblod.data.gift/display-types/remoteUrls': `rdf-input-fields/remote-urls/show`,
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
    'http://lblod.data.gift/display-types/climateSubsidyCostTable': `custom-subsidy-form-fields/climate-subsidy-costs-table/show`,
    'http://lblod.data.gift/display-types/caseNumber': `rdf-input-fields/case-number/show`,
    'http://lblod.data.gift/display-types/estimatedCostTable': `custom-subsidy-form-fields/estimated-cost-table/show`,
    'http://lblod.data.gift/display-types/objectiveTable': `custom-subsidy-form-fields/objective-table/show`,
    'http://lblod.data.gift/display-types/engagementTable': `custom-subsidy-form-fields/engagement-table/show`,
    'http://lblod.data.gift/display-types/conceptSchemeMultiSelectCheckboxes': `rdf-input-fields/concept-scheme-multi-select-checkboxes/show`
  }
};

export default helper(function componentForDisplayType([displayType], {show}) {
  let components = mapping.edit;
  if(show) components = mapping.show;

  assert(
    `"${displayType}" did not resolve to a component name. Make sure the mapping exists or it doesn't contain any typos.`,
    components[displayType]
  );

  return components[displayType];
});
