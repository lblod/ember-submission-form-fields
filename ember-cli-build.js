'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

const webpackConfig = {
  resolve: {
    fallback: {
      // @frogcat/ttl2jsonld (which is a dependency of rdflib) conditionally requires this here: https://github.com/frogcat/ttl2jsonld/blob/686ae54dd13c5769750a0dd879c5551c8e1ca7ad/ttl2jsonld.js#L4617
      // We disable this import for our test app, but it's likely that consuming apps will also run into this, so we should find a solution, or document that this is needed.
      url: false,
    },
  },
};

module.exports = function (defaults) {
  const customBuildConfig = {
    // TODO: Remove this once we release v3
    '@lblod/ember-submission-form-fields': {
      helpTextBelowLabel: true,
    },
    '@appuniversum/ember-appuniversum': {
      dutchDatePickerLocalization: true,
      disableWormholeElement: true,
    },
    autoImport: {
      webpack: webpackConfig,
    },
  };

  let app = new EmberAddon(defaults, customBuildConfig);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig,
    },
  });
};
