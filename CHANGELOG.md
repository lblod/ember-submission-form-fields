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
