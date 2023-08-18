'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  rules: {
    'selector-class-pattern': null, // This rule enforces kebab-case by default, but Appuniversum use BEM, which isn't compatible.
  },
};
