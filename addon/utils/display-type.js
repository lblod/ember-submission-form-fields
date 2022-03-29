import { assert } from '@ember/debug';

// Basic fields
import BestuursorgaanSelectorEditComponent from '@lblod/ember-submission-form-fields/components/custom-submission-form-fields/bestuursorgaan-selector/edit';
import BestuursorgaanSelectorShowComponent from '@lblod/ember-submission-form-fields/components/custom-submission-form-fields/bestuursorgaan-selector/show';
import CaseNumberEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/case-number/edit';
import CaseNumberShowComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/case-number/show';
import CheckboxComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/checkbox';
import ConceptSchemeRadioButtonsComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-radio-buttons';
import ConceptSchemeSelectorComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-selector';
import ConceptSchemeMultiSelectorComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-multi-selector';
import ConceptSchemeMultiSelectCheckboxesComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-multi-select-checkboxes';
import DateComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date';
import DateTimeComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date-time';
import FilesEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/files/edit';
import FilesShowComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/files/show';
import InputComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input';
import NumericalInputComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/numerical-input';
import PropertyGroupComponent from '@lblod/ember-submission-form-fields/components/property-group';
import RemoteUrlsEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/remote-urls/edit';
import CustomRemoteUrlsEditComponent from '@lblod/ember-submission-form-fields/components/custom-submission-form-fields/remote-urls/edit';
import RemoteUrlsShowComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/remote-urls/show';
import SwitchComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/switch';
import TextAreaComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/text-area';
import VlabelOpcentiemEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/vlabel-opcentiem/edit';
import VlabelOpcentiemShowComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/vlabel-opcentiem/show';

// Search related fields
import CustomSearchEditComponent from '@lblod/ember-submission-form-fields/components/search-panel-fields/search/edit';
import CustomSearchShowComponent from '@lblod/ember-submission-form-fields/components/search-panel-fields/search/show';
import DateRangeEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date-range/edit';
import DateRangeShowComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date-range/show';
import SearchEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/search/edit';
import SearchShowComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/search/show';

// Custom table components
import ApplicationFormTableEditComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/application-form-table/edit';
import ApplicationFormTableShowComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/application-form-table/show';
import ClimateSubsidyCostsTableEditComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/climate-subsidy-costs-table/edit';
import ClimateSubsidyCostsTableShowComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/climate-subsidy-costs-table/show';
import EngagementTableEditComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/engagement-table/edit';
import EngagementTableShowComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/engagement-table/show';
import EstimatedCostEditComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/estimated-cost-table/edit';
import EstimatedCostShowComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/estimated-cost-table/show';
import ObjectiveTableEditComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/objective-table/edit';
import ObjectiveTableShowComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/objective-table/show';
import PlanLivingTogetherTableEditComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/plan-living-together-table/edit';
import PlanLivingTogetherTableShowComponent from '@lblod/ember-submission-form-fields/components/custom-subsidy-form-fields/plan-living-together-table/show';

export function getComponentForDisplayType(displayType, show) {
  let component;

  if (show) {
    component = SHOW_COMPONENTS[displayType];
  }

  if (!component) {
    component = EDIT_COMPONENTS[displayType];
  }

  assert(
    `No ${
      show ? 'show (or edit)' : 'edit'
    } component has been registered for display type "${displayType}".`,
    component
  );

  return component;
}

const EDIT_COMPONENTS = {
  'http://lblod.data.gift/display-types/bestuursorgaanSelector':
    BestuursorgaanSelectorEditComponent,
  'http://lblod.data.gift/display-types/caseNumber': CaseNumberEditComponent,
  'http://lblod.data.gift/display-types/checkbox': CheckboxComponent,
  'http://lblod.data.gift/display-types/conceptSchemeMultiSelectCheckboxes':
    ConceptSchemeMultiSelectCheckboxesComponent,
  'http://lblod.data.gift/display-types/conceptSchemeMultiSelector':
    ConceptSchemeMultiSelectorComponent,
  'http://lblod.data.gift/display-types/conceptSchemeRadioButtons':
    ConceptSchemeRadioButtonsComponent,
  'http://lblod.data.gift/display-types/conceptSchemeSelector':
    ConceptSchemeSelectorComponent,
  'http://lblod.data.gift/display-types/date': DateComponent,
  'http://lblod.data.gift/display-types/dateTime': DateTimeComponent,
  'http://lblod.data.gift/display-types/defaultInput': InputComponent,
  'http://lblod.data.gift/display-types/files': FilesEditComponent,
  'http://lblod.data.gift/display-types/files/variation/1': FilesEditComponent,
  'http://lblod.data.gift/display-types/numericalInput':
    NumericalInputComponent,
  'http://lblod.data.gift/display-types/property-group': PropertyGroupComponent,
  'http://lblod.data.gift/display-types/remoteUrls':
    CustomRemoteUrlsEditComponent,
  'http://lblod.data.gift/display-types/remoteUrls/variation/1':
    RemoteUrlsEditComponent,
  'http://lblod.data.gift/display-types/switch': SwitchComponent,
  'http://lblod.data.gift/display-types/textArea': TextAreaComponent,
  'http://lblod.data.gift/display-types/vLabelOpcentiem':
    VlabelOpcentiemEditComponent,

  'http://lblod.data.gift/display-types/customSearch':
    CustomSearchEditComponent,
  'http://lblod.data.gift/display-types/dateRange': DateRangeEditComponent,
  'http://lblod.data.gift/display-types/search': SearchEditComponent,

  'http://lblod.data.gift/display-types/applicationFormTable':
    ApplicationFormTableEditComponent,
  'http://lblod.data.gift/display-types/climateSubsidyCostTable':
    ClimateSubsidyCostsTableEditComponent,
  'http://lblod.data.gift/display-types/engagementTable':
    EngagementTableEditComponent,
  'http://lblod.data.gift/display-types/estimatedCostTable':
    EstimatedCostEditComponent,
  'http://lblod.data.gift/display-types/objectiveTable':
    ObjectiveTableEditComponent,
  'http://lblod.data.gift/display-types/planLivingTogetherTable':
    PlanLivingTogetherTableEditComponent,
};

const SHOW_COMPONENTS = {
  'http://lblod.data.gift/display-types/bestuursorgaanSelector':
    BestuursorgaanSelectorShowComponent,
  'http://lblod.data.gift/display-types/caseNumber': CaseNumberShowComponent,
  'http://lblod.data.gift/display-types/files': FilesShowComponent,
  'http://lblod.data.gift/display-types/files/variation/1': FilesShowComponent,
  'http://lblod.data.gift/display-types/property-group': PropertyGroupComponent,
  'http://lblod.data.gift/display-types/remoteUrls': RemoteUrlsShowComponent,
  'http://lblod.data.gift/display-types/remoteUrls/variation/1':
    RemoteUrlsShowComponent,
  'http://lblod.data.gift/display-types/vLabelOpcentiem':
    VlabelOpcentiemShowComponent,

  'http://lblod.data.gift/display-types/dateRange': DateRangeShowComponent,
  'http://lblod.data.gift/display-types/search': SearchShowComponent,
  'http://lblod.data.gift/display-types/customSearch':
    CustomSearchShowComponent,

  'http://lblod.data.gift/display-types/applicationFormTable':
    ApplicationFormTableShowComponent,
  'http://lblod.data.gift/display-types/climateSubsidyCostTable':
    ClimateSubsidyCostsTableShowComponent,
  'http://lblod.data.gift/display-types/engagementTable':
    EngagementTableShowComponent,
  'http://lblod.data.gift/display-types/estimatedCostTable':
    EstimatedCostShowComponent,
  'http://lblod.data.gift/display-types/objectiveTable':
    ObjectiveTableShowComponent,
  'http://lblod.data.gift/display-types/planLivingTogetherTable':
    PlanLivingTogetherTableShowComponent,
};
