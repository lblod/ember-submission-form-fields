'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const customBuildConfig = {
    // Add options here
    '@appuniversum/ember-appuniversum': {
      dutchDatePickerLocalization: true,
      disableWormholeElement: true,
    },
  };

  let app = new EmberAddon(defaults, customBuildConfig);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // The built-in compat adapters for Ember Data shouldn't be needed anymore.
  // This code can be removed once https://github.com/embroider-build/embroider/pull/1369 is released.
  const compatAdapters = new Map();
  compatAdapters.set('ember-data', null);
  compatAdapters.set('@ember-data/adapter', null);
  compatAdapters.set('@ember-data/model', null);
  compatAdapters.set('@ember-data/record-data', null);
  compatAdapters.set('@ember-data/serializer', null);
  compatAdapters.set('@ember-data/store', null);

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packageRules: [
      {
        package: '@ember-data/store',
        addonModules: {
          '-private.js': {
            dependsOnModules: [],
          },
          '-private/system/core-store.js': {
            dependsOnModules: [],
          },
          '-private/system/model/internal-model.js': {
            dependsOnModules: [],
          },
        },
      },
    ],
    compatAdapters,
  });
};
