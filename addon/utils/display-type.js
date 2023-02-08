import { assert } from '@ember/debug';

// Basic fields
import BestuursorgaanSelectorEditComponent from '@lblod/ember-submission-form-fields/components/custom-submission-form-fields/bestuursorgaan-selector/edit';
import BestuursorgaanSelectorShowComponent from '@lblod/ember-submission-form-fields/components/custom-submission-form-fields/bestuursorgaan-selector/show';
import CaseNumberComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/case-number';
import CheckboxComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/checkbox';
import ConceptSchemeRadioButtonsComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-radio-buttons';
import ConceptSchemeSelectorComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-selector';
import ConceptSchemeMultiSelectorComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-multi-selector';
import ConceptSchemeMultiSelectCheckboxesComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/concept-scheme-multi-select-checkboxes';
import DateComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date';
import DatePickerComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date-picker';
import DateTimeComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date-time';
import FilesComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/files';
import InputComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input';
import NumericalInputComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/numerical-input';
import PropertyGroupComponent from '@lblod/ember-submission-form-fields/components/property-group';
import RemoteUrlsEditComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/remote-urls/edit';
import CustomRemoteUrlsEditComponent from '@lblod/ember-submission-form-fields/components/custom-submission-form-fields/remote-urls/edit';
import RemoteUrlsShowComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/remote-urls/show';
import SwitchComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/switch';
import TextAreaComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/text-area';
import VlabelOpcentiemComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/vlabel-opcentiem';
import HeadingComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/heading';
// Search components
import SearchPanelFieldsSearchEditComponent from '@lblod/ember-submission-form-fields/components/search-panel-fields/search/edit';
import SearchPanelFieldsSearchShowComponent from '@lblod/ember-submission-form-fields/components/search-panel-fields/search/show';
import DateRangeComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/date-range';
import SearchComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/search';

const BUILT_IN_EDIT_COMPONENTS = new Map();
const BUILT_IN_SHOW_COMPONENTS = new Map();
const CUSTOM_EDIT_COMPONENTS = new Map();
const CUSTOM_SHOW_COMPONENTS = new Map();

export function registerFormFields(customFields) {
  registerComponentsForDisplayType(customFields, false);
}

// Private utils

export function registerComponentsForDisplayType(
  formFields = [],
  shouldBeRegisteredAsBuiltIn = true
) {
  assert(
    'The form fields should be provided as an array',
    Array.isArray(formFields)
  );

  formFields.forEach(({ displayType, edit, show }) => {
    assert(
      '`displayType` is required when registering a form field',
      typeof displayType === 'string'
    );

    assert(
      `Registering a component for the '${displayType}' display type isn't allowed since a built-in component already handles it.`,
      !BUILT_IN_SHOW_COMPONENTS.has(displayType) &&
        !BUILT_IN_EDIT_COMPONENTS.has(displayType)
    );

    assert(
      `The edit component is required when registering custom fields`,
      Boolean(edit)
    );

    if (shouldBeRegisteredAsBuiltIn) {
      registerBuiltInComponent(displayType, edit, show);
    } else {
      registerCustomComponent(displayType, edit, show);
    }
  });
}

function registerCustomComponent(displayType, editComponent, showComponent) {
  CUSTOM_EDIT_COMPONENTS.set(displayType, editComponent);

  if (showComponent) {
    CUSTOM_SHOW_COMPONENTS.set(displayType, showComponent);
  }
}

function registerBuiltInComponent(displayType, editComponent, showComponent) {
  BUILT_IN_EDIT_COMPONENTS.set(displayType, editComponent);

  if (showComponent) {
    BUILT_IN_SHOW_COMPONENTS.set(displayType, showComponent);
  }
}

export function resetCustomComponentRegistrations() {
  CUSTOM_SHOW_COMPONENTS.clear();
  CUSTOM_EDIT_COMPONENTS.clear();
}

export function resetBuiltInComponentRegistrations() {
  BUILT_IN_EDIT_COMPONENTS.clear();
  BUILT_IN_SHOW_COMPONENTS.clear();
}

export function getComponentForDisplayType(displayType, show) {
  let component;

  if (show) {
    component = BUILT_IN_SHOW_COMPONENTS.get(displayType);
  }

  if (!component) {
    component = BUILT_IN_EDIT_COMPONENTS.get(displayType);
  }

  if (show && !component) {
    component = CUSTOM_SHOW_COMPONENTS.get(displayType);
  }

  if (!component) {
    component = CUSTOM_EDIT_COMPONENTS.get(displayType);
  }

  assert(
    `No ${
      show ? 'show (or edit)' : 'edit'
    } component has been registered for display type "${displayType}".`,
    component
  );

  return component;
}

// Register all the built-in components
registerComponentsForDisplayType([
  // Basic fields
  {
    displayType: 'http://lblod.data.gift/display-types/bestuursorgaanSelector',
    edit: BestuursorgaanSelectorEditComponent,
    show: BestuursorgaanSelectorShowComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/caseNumber',
    edit: CaseNumberComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/heading',
    edit: HeadingComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/checkbox',
    edit: CheckboxComponent,
  },
  {
    displayType:
      'http://lblod.data.gift/display-types/conceptSchemeMultiSelectCheckboxes',
    edit: ConceptSchemeMultiSelectCheckboxesComponent,
  },
  {
    displayType:
      'http://lblod.data.gift/display-types/conceptSchemeMultiSelector',
    edit: ConceptSchemeMultiSelectorComponent,
  },
  {
    displayType:
      'http://lblod.data.gift/display-types/conceptSchemeRadioButtons',
    edit: ConceptSchemeRadioButtonsComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/conceptSchemeSelector',
    edit: ConceptSchemeSelectorComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/date',
    edit: DateComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/datePicker',
    edit: DatePickerComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/dateTime',
    edit: DateTimeComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/defaultInput',
    edit: InputComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/files',
    edit: FilesComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/files/variation/1',
    edit: FilesComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/numericalInput',
    edit: NumericalInputComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/property-group',
    edit: PropertyGroupComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/remoteUrls',
    edit: CustomRemoteUrlsEditComponent,
    show: RemoteUrlsShowComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/remoteUrls/variation/1',
    edit: RemoteUrlsEditComponent,
    show: RemoteUrlsShowComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/switch',
    edit: SwitchComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/textArea',
    edit: TextAreaComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/vLabelOpcentiem',
    edit: VlabelOpcentiemComponent,
  },

  // Search related fields
  {
    displayType: 'http://lblod.data.gift/display-types/customSearch',
    edit: SearchPanelFieldsSearchEditComponent,
    show: SearchPanelFieldsSearchShowComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/dateRange',
    edit: DateRangeComponent,
  },
  {
    displayType: 'http://lblod.data.gift/display-types/search',
    edit: SearchComponent,
  },
]);
