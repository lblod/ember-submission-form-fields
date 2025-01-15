## v2.25.0 (2025-01-15)

#### :rocket: Enhancement
* [#201](https://github.com/lblod/ember-submission-form-fields/pull/201) Add support for ember-truth-helpers v4 ([@Windvis](https://github.com/Windvis))
* [#199](https://github.com/lblod/ember-submission-form-fields/pull/199) Add support for ember-concurrency v4 and power select v8 ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#200](https://github.com/lblod/ember-submission-form-fields/pull/200) Update to Ember 5.12 LTS ([@Windvis](https://github.com/Windvis))

## v2.24.2 (2025-01-14)

#### :bug: Bug Fix
* [#195](https://github.com/lblod/ember-submission-form-fields/pull/195) Fix "true" value handling in boolean components (checkbox/switch) ([@x-m-el](https://github.com/x-m-el))

## v2.24.1 (2025-01-06)

#### :bug: Bug Fix
* [#197](https://github.com/lblod/ember-submission-form-fields/pull/197) [DL-5449] Fix an issue with the "RemoteUrl" field ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#198](https://github.com/lblod/ember-submission-form-fields/pull/198) Fix the Embroider test scenarios ([@Windvis](https://github.com/Windvis))

## v2.24.0 (2024-12-18)

#### :rocket: Enhancement

* [#196](https://github.com/lblod/ember-submission-form-fields/pull/196) Allow HTML to be rendered in alert ([@benjay10](https://github.com/benjay10))

## v2.23.0 (2024-10-22)

#### :rocket: Enhancement
* [#193](https://github.com/lblod/ember-submission-form-fields/pull/193) Experimental: optionally use lazy generators in forms ([@rahien](https://github.com/rahien))


## v2.22.2 (2024-07-16)

#### :bug: Bug Fix
* [#192](https://github.com/lblod/ember-submission-form-fields/pull/192) Ensure searchEnabled option may be left unspecified for concept-scheme-selector components ([@cecemel](https://github.com/cecemel))

## v2.22.1 (2024-04-24)

#### :bug: Bug Fix
* [#191](https://github.com/lblod/ember-submission-form-fields/pull/191) LMB-326: update the uri to form-field-options ([@JonasVanHoof](https://github.com/JonasVanHoof))

## v2.22.0 (2024-04-23)

#### :rocket: Enhancement
* [#189](https://github.com/lblod/ember-submission-form-fields/pull/189) LMB-326: Support field options as separate predicates ([@JonasVanHoof](https://github.com/JonasVanHoof))

#### :bug: Bug Fix
* [#190](https://github.com/lblod/ember-submission-form-fields/pull/190) Remove the data from the store when clearing the numerical-input field ([@bfidlers](https://github.com/bfidlers))

## v2.21.0 (2024-04-10)

#### :rocket: Enhancement
* [#187](https://github.com/lblod/ember-submission-form-fields/pull/187) add mu:uuid when creating remote-url ([@aatauil](https://github.com/aatauil))

#### :bug: Bug Fix
* [#185](https://github.com/lblod/ember-submission-form-fields/pull/185) SFB-224: Required validation on currency input ([@JonasVanHoof](https://github.com/JonasVanHoof))

## v2.20.1 (2024-04-04)

#### :bug: Bug Fix
* [#184](https://github.com/lblod/ember-submission-form-fields/pull/184) V2.20.0 failed. This version will have the feature of v2.20.0 ([@JonasVanHoof](https://github.com/JonasVanHoof))

## v2.20.0 (2024-04-03)

#### :rocket: Enhancement
* [#184](https://github.com/lblod/ember-submission-form-fields/pull/184) [SFB-248] Conceptscheme radio buttons with order by property in form:options ([@JonasVanHoof](https://github.com/JonasVanHoof))

## v2.19.0 (2024-03-12)

#### :rocket: Enhancement
* [#181](https://github.com/lblod/ember-submission-form-fields/pull/181) Add bulk download support to the files and remote-url fields ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#180](https://github.com/lblod/ember-submission-form-fields/pull/180) Fix some auto focus related issues ([@Windvis](https://github.com/Windvis))

## v2.18.0 (2024-02-07)

#### :rocket: Enhancement
* [#173](https://github.com/lblod/ember-submission-form-fields/pull/173) Switch to Woodpecker CI ([@Windvis](https://github.com/Windvis))
* [#174](https://github.com/lblod/ember-submission-form-fields/pull/174) Create EURO currency input component ([@JonasVanHoof](https://github.com/JonasVanHoof))
* [#175](https://github.com/lblod/ember-submission-form-fields/pull/175) Hide labels in show mode ([@Windvis](https://github.com/Windvis))

## v2.17.2 (2024-01-30)

#### :bug: Bug Fix
* [#172](https://github.com/lblod/ember-submission-form-fields/pull/172) Fix `isValid` logic to prevent false positives ([@ZijneDwaasheid](https://github.com/ZijneDwaasheid))

## v2.17.1 (2024-01-29)

#### :bug: Bug Fix
* Update the form helpers package for warning validation support([@Windvis](https://github.com/Windvis))

## v2.17.0 (2024-01-29)

#### :rocket: Enhancement
* [#171](https://github.com/lblod/ember-submission-form-fields/pull/171) [DL-5622] Add support for validation "warnings" ([@Windvis](https://github.com/Windvis))

## v2.16.0 (2024-01-16)

#### :rocket: Enhancement
* [#162](https://github.com/lblod/ember-submission-form-fields/pull/162) [LMB-34] Fully support v2 of the form data model ([@Rahien](https://github.com/Rahien))
* [#169](https://github.com/lblod/ember-submission-form-fields/pull/169) Add support for Appuniversum v3 ([@Windvis](https://github.com/Windvis))

## 2.15.1 (2024-01-10)

#### :bug: Bug Fix
* [#168](https://github.com/lblod/ember-submission-form-fields/pull/168) Make sure the remote url preview link is displayed when available ([@Windvis](https://github.com/Windvis))

## v2.14.2 (2023-11-27)

#### :bug: Bug Fix
* [#160](https://github.com/lblod/ember-submission-form-fields/pull/160) Show a warning when the `conceptScheme` option is missing for the fields with options that require this property to be set. (concept-scheme-multi-select-checkboxes, concept-scheme-radio-buttons, concept-scheme-multi-selector) ([@JonasVanHoof](https://github.com/JonasVanHoof))

#### :bug: Bug Fix
* [#156](https://github.com/lblod/ember-submission-form-fields/pull/156) Show a warning when the `conceptScheme` option is missing for the concept-scheme-selector field ([@JonasVanHoof](https://github.com/JonasVanHoof))

## v2.14.1 (2023-10-04)

#### :bug: Bug Fix
* [#152](https://github.com/lblod/ember-submission-form-fields/pull/152) Fix an issue where new listing order values aren't the highest value ([@Windvis](https://github.com/Windvis))

## v2.14.0 (2023-10-04)
#### :rocket: Enhancement
* [#150](https://github.com/lblod/ember-submission-form-fields/pull/150) Add a new reordering option to the listings ([@Windvis](https://github.com/Windvis))

## v2.13.1 (2023-09-26)

#### :bug: Bug Fix
* [#149](https://github.com/lblod/ember-submission-form-fields/pull/149) Fix an issue with listing ordering after adding or removing items ([@Windvis](https://github.com/Windvis))

## v2.13.0 (2023-09-20)

#### :rocket: Enhancement
* [#147](https://github.com/lblod/ember-submission-form-fields/pull/147) Resolve Appuniversum deprecations ([@Windvis](https://github.com/Windvis))
* [#143](https://github.com/lblod/ember-submission-form-fields/pull/143) Remove ember-fetch ([@Windvis](https://github.com/Windvis))

## v2.12.2 (2023-09-19)

#### :bug: Bug Fix
* [#142](https://github.com/lblod/ember-submission-form-fields/pull/142) Stop the `PropertyGroup` observer when it's being destroyed ([@Windvis](https://github.com/Windvis))

## v2.12.1 (2023-08-21)

#### :bug: Bug Fix
* [#141](https://github.com/lblod/ember-submission-form-fields/pull/141) Allow ember-source v3 ([@Windvis](https://github.com/Windvis))

## v2.12.0 (2023-08-21)

#### :rocket: Enhancement
* [#136](https://github.com/lblod/ember-submission-form-fields/pull/136) Resolve `AuToggleSwitch` deprecations ([@Windvis](https://github.com/Windvis))
* [#135](https://github.com/lblod/ember-submission-form-fields/pull/135) Widen dependency version ranges ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#140](https://github.com/lblod/ember-submission-form-fields/pull/140) Remove the `convert-to-currency` helper ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#138](https://github.com/lblod/ember-submission-form-fields/pull/138) Remove ember-math-helpers ([@Windvis](https://github.com/Windvis))
* [#137](https://github.com/lblod/ember-submission-form-fields/pull/137) Update to the new `ember-concurrency` task syntax ([@Windvis](https://github.com/Windvis))

## v2.11.0 (2023-06-21)

#### :rocket: Enhancement
* [#133](https://github.com/lblod/ember-submission-form-fields/pull/133) Add a new alert field ([@Windvis](https://github.com/Windvis))

## v2.10.0 (2023-04-21)

#### :rocket: Enhancement
* [#131](https://github.com/lblod/ember-submission-form-fields/pull/131) Add `sh:minCount` support to the listing component ([@Windvis](https://github.com/Windvis))

## v2.9.1 (2023-04-13)

#### :bug: Bug Fix
* [8e6b25f](https://github.com/lblod/ember-submission-form-fields/commit/8e6b25fa8dd6b3c8bb7fb77f3728a512e2388ca4) Allow users to set attributes on the RdfForm component ([@Windvis](https://github.com/Windvis))

## v2.9.0 (2023-04-13)

#### :rocket: Enhancement
* [#130](https://github.com/lblod/ember-submission-form-fields/pull/130) Table field improvements ([@Windvis](https://github.com/Windvis))
* [#128](https://github.com/lblod/ember-submission-form-fields/pull/128) Listing layout improvements ([@Windvis](https://github.com/Windvis))
* [#126](https://github.com/lblod/ember-submission-form-fields/pull/126) Hide the label and description when the textarea field is used in a table ([@Windvis](https://github.com/Windvis))
* [#124](https://github.com/lblod/ember-submission-form-fields/pull/124) Hide the label and helptext when the date field is used in a table ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#129](https://github.com/lblod/ember-submission-form-fields/pull/129) Fix the subform title levels ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#127](https://github.com/lblod/ember-submission-form-fields/pull/127) Update Ember Data to 4.12.0 ([@Windvis](https://github.com/Windvis))


## v2.8.0 (2023-03-30)

#### :rocket: Enhancement
* [#122](https://github.com/lblod/ember-submission-form-fields/pull/122) Add an option to display the row index in the listing table ([@Windvis](https://github.com/Windvis))
* [#123](https://github.com/lblod/ember-submission-form-fields/pull/123) Appuniversum "control" component improvements ([@Windvis](https://github.com/Windvis))

## v2.7.1 (2023-03-24)

#### :bug: Bug Fix
* [#121](https://github.com/lblod/ember-submission-form-fields/pull/121) Fix some embroider issues ([@Windvis](https://github.com/Windvis))

## v2.7.0 (2023-02-27)

#### :rocket: Enhancement
* [#120](https://github.com/lblod/ember-submission-form-fields/pull/120) Persist the order of listing entries ([@Windvis](https://github.com/Windvis))
* [#119](https://github.com/lblod/ember-submission-form-fields/pull/119) Resolve `.firstObject` deprecations on newer Ember Data versions ([@Windvis](https://github.com/Windvis))

## v2.6.1 (2023-02-14)

#### :bug: Bug Fix
* [#118](https://github.com/lblod/ember-submission-form-fields/pull/118) Use `@value` argument for the `<AuInput>` component ([@Windvis](https://github.com/Windvis))

## v2.6.0 (2023-02-08)

#### :rocket: Enhancement
* [#117](https://github.com/lblod/ember-submission-form-fields/pull/117) Use the `AuDateInput` component for the dateTime display type ([@Windvis](https://github.com/Windvis))

## v2.5.0 (2023-02-08)

#### :rocket: Enhancement
* [#116](https://github.com/lblod/ember-submission-form-fields/pull/116) Update uuid to v9 ([@Windvis](https://github.com/Windvis))
* [#115](https://github.com/lblod/ember-submission-form-fields/pull/115) Date display type changes ([@Windvis](https://github.com/Windvis))

## v2.4.2 (2023-01-27)
#### :bug: Bug Fix
* [#114](https://github.com/lblod/ember-submission-form-fields/pull/114) Fix an exception in the VlabelOpcentiem component ([@Windvis](https://github.com/Windvis))

## v2.4.1 (2023-01-06)

#### :bug: Bug Fix
* [#113](https://github.com/lblod/ember-submission-form-fields/pull/113) Remove the .data-table styles ([@Windvis](https://github.com/Windvis))
* [#111](https://github.com/lblod/ember-submission-form-fields/pull/111) ListingTable: hide the delete column if the table is empty ([@Windvis](https://github.com/Windvis))
* [#110](https://github.com/lblod/ember-submission-form-fields/pull/110) Update the date help text to the correct format ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#112](https://github.com/lblod/ember-submission-form-fields/pull/112) Replace the FileCard component with the AuFileCard component ([@Windvis](https://github.com/Windvis))

## v2.4.0 (2022-12-08)

#### :rocket: Enhancement
* [#104](https://github.com/lblod/ember-submission-form-fields/pull/104) Add a "table-mode" to the listing component ([@Windvis](https://github.com/Windvis))
* [#107](https://github.com/lblod/ember-submission-form-fields/pull/107) Resolve "mutation after consumption" deprecations ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#108](https://github.com/lblod/ember-submission-form-fields/pull/108) Ember v4.8.0 blueprint update ([@Windvis](https://github.com/Windvis))

## v2.3.0 (2022-11-17)

#### :rocket: Enhancement
* [#106](https://github.com/lblod/ember-submission-form-fields/pull/106) Add support for Appuniversum v2 ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#105](https://github.com/lblod/ember-submission-form-fields/pull/105) Remove the custom date picker localization ([@Windvis](https://github.com/Windvis))

## v2.2.0 (2022-10-25)

#### :rocket: Enhancement
* [#102](https://github.com/lblod/ember-submission-form-fields/pull/102) Add a Heading component ([@FangioD](https://github.com/FangioD))

## v2.1.1 (2022-10-17)

#### :bug: Bug Fix
* [#101](https://github.com/lblod/ember-submission-form-fields/pull/101) Fix a bug in the listing creation code ([@Windvis](https://github.com/Windvis))

## v2.1.0 (2022-08-30)

#### :rocket: Enhancement
* [#96](https://github.com/lblod/ember-submission-form-fields/pull/96) Make the PropertyGroup title level and skin configurable ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#100](https://github.com/lblod/ember-submission-form-fields/pull/100) Add a button to trigger validations in the test app ([@cecemel](https://github.com/cecemel))

## v2.0.3 (2022-08-23)

#### :bug: Bug Fix
* [#98](https://github.com/lblod/ember-submission-form-fields/pull/98) Improve the read-only mode of the Listing and SubForm components ([@Asergey91](https://github.com/Asergey91))

## v2.0.2 (2022-08-17)

#### :bug: Bug Fix
* [#95](https://github.com/lblod/ember-submission-form-fields/pull/95) Only use the lang string logic if the predicate is set ([@Windvis](https://github.com/Windvis))

## v2.0.1 (2022-08-11)

#### :house: Internal
* [#86](https://github.com/lblod/ember-submission-form-fields/pull/86) Remove `@renderInPlace` from the ConceptSchemeSelector component ([@Windvis](https://github.com/Windvis))

## v2.0.0 (2022-08-09)

#### :boom: Breaking Change
* [#90](https://github.com/lblod/ember-submission-form-fields/pull/90) Drop node 12 support ([@Windvis](https://github.com/Windvis))
* [#89](https://github.com/lblod/ember-submission-form-fields/pull/89) Drop ember 3.24 support ([@Windvis](https://github.com/Windvis))
* [#88](https://github.com/lblod/ember-submission-form-fields/pull/88) "Optional" component changes  ([@Windvis](https://github.com/Windvis))
* [#87](https://github.com/lblod/ember-submission-form-fields/pull/87) Replace browser-rdfib with rdflib v2 ([@Windvis](https://github.com/Windvis))

#### :rocket: Enhancement
* [#92](https://github.com/lblod/ember-submission-form-fields/pull/92) Add ember-power-select v6 support ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#93](https://github.com/lblod/ember-submission-form-fields/pull/93) Remove ember-test-selectors ([@Windvis](https://github.com/Windvis))
* [#91](https://github.com/lblod/ember-submission-form-fields/pull/91) Update to uuid v8 ([@Windvis](https://github.com/Windvis))

## 1.9.2 (2022-08-18)

#### :bug: Bug Fix
* [#97](https://github.com/lblod/ember-submission-form-fields/pull/97) Only use the lang string logic if the predicate is set ([@Windvis](https://github.com/Windvis))

## v1.9.1 (2022-08-09)

#### :bug: Bug Fix
* Revert PR [#84](https://github.com/lblod/ember-submission-form-fields/pull/84) since it was actually a breaking change ([@Windvis](https://github.com/Windvis))

## v1.9.0 (2022-08-01)

#### :rocket: Enhancement
* [#84](https://github.com/lblod/ember-submission-form-fields/pull/84) Replace browser-rdflib with rdflib v2 ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#85](https://github.com/lblod/ember-submission-form-fields/pull/85) Resolve the AuToolbarGroup deprecation ([@Windvis](https://github.com/Windvis))

## 1.8.1 (2022-06-31)

#### :bug: Bug Fix
* [#83](https://github.com/lblod/ember-submission-form-fields/pull/83) fix bug langstring

## 1.8.0 (2022-06-30)
#### :rocket: Enhancement
* [#79](https://github.com/lblod/ember-submission-form-fields/pull/79) updated form model
* [#81](https://github.com/lblod/ember-submission-form-fields/pull/81) lang string support for simple input value fields
* [#82](https://github.com/lblod/ember-submission-form-fields/pull/82) some improvements lang string support

## 1.7.2 (2022-05-10)

#### :bug: Bug Fix
* [#76](https://github.com/lblod/ember-submission-form-fields/pull/76) Fix the problem where the case-number error message was always shown ([@Windvis](https://github.com/Windvis))

## 1.7.1 (2022-04-28)

#### :bug: Bug Fix
* [#73](https://github.com/lblod/ember-submission-form-fields/pull/73) Resolve `AuAlert` deprecation warnings ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#75](https://github.com/lblod/ember-submission-form-fields/pull/75) Install Webpack as a devDependency ([@Windvis](https://github.com/Windvis))
* [#74](https://github.com/lblod/ember-submission-form-fields/pull/74) Use MSW to mock the case-number request ([@Windvis](https://github.com/Windvis))

## 1.7.0 (2022-04-21)

#### :rocket: Enhancement
* [#70](https://github.com/lblod/ember-submission-form-fields/pull/70) Add flags to disable some of the built-in components ([@Windvis](https://github.com/Windvis))
* [#65](https://github.com/lblod/ember-submission-form-fields/pull/65) Custom form field component registration ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#71](https://github.com/lblod/ember-submission-form-fields/pull/71) Ensure checkboxes show the correct checked state when data is loaded ([@Windvis](https://github.com/Windvis))
* [#72](https://github.com/lblod/ember-submission-form-fields/pull/72) Fix a problem where number input fields were displayed as text input fields ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#52](https://github.com/lblod/ember-submission-form-fields/pull/52) Parse field options in the field model ([@Windvis](https://github.com/Windvis))

## v1.6.0 (2022-04-08)

#### :rocket: Enhancement
* [#66](https://github.com/lblod/ember-submission-form-fields/pull/66) "Plan samenleven" subsidy modifications ([@aatauil](https://github.com/aatauil))
* [#48](https://github.com/lblod/ember-submission-form-fields/pull/48) Optionally add new actions to the climate subsidy table ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix
* [#64](https://github.com/lblod/ember-submission-form-fields/pull/64) Fix climate table row links ([@Windvis](https://github.com/Windvis))
* [#53](https://github.com/lblod/ember-submission-form-fields/pull/53) Display type mapping improvements ([@Windvis](https://github.com/Windvis))
* [#60](https://github.com/lblod/ember-submission-form-fields/pull/60) Enable the "burgemeesterconvenant" row for the edit table ([@Windvis](https://github.com/Windvis))
* [#61](https://github.com/lblod/ember-submission-form-fields/pull/61) Fix the disabled state of the form fields when the form is in readonly mode ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#54](https://github.com/lblod/ember-submission-form-fields/pull/54) Deduplicate field components ([@Windvis](https://github.com/Windvis))

#### Committers: 2
- Achraf Atauil ([@aatauil](https://github.com/aatauil))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))

## v1.5.0 (2022-03-31)

#### :rocket: Enhancement
* [#55](https://github.com/lblod/ember-submission-form-fields/pull/55) "Plan samenleven" subsidy improvements ([@aatauil](https://github.com/aatauil))

#### :bug: Bug Fix
* [#57](https://github.com/lblod/ember-submission-form-fields/pull/57) Make sure that the accordion subtitles are shown ([@Windvis](https://github.com/Windvis))

#### :house: Internal
* [#58](https://github.com/lblod/ember-submission-form-fields/pull/58) Remove all "default" tests ([@Windvis](https://github.com/Windvis))

#### Committers: 2
- Achraf Atauil ([@aatauil](https://github.com/aatauil))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))

## 1.4.0 (2022-03-25)
#### :house: Internal
  - added plan samenleven table
  - minor bugfixes

## 1.3.0 (2022-03-22)
#### :house: Internal
  - refactored dummy app

## 1.2.0 (2022-03-22)
#### :house: Internal
  - bump submission form fields (extra conditions are possible)
  - extend dummy app

## 1.1.0 (2022-03-21)
#### :house: Internal
  - Re-write CHANGELOG.md
  - plugin @release-it/conventional-changelog not very clear change log

## 1.0.5 (2022-03-21)
#### :house: Internal=
  - setting up drone.yml configs

## 1.0.0 (2022-03-21)
#### :house: Internal
  - :fireworks: first major release
