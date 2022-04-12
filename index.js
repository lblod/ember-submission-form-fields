'use strict';

const Funnel = require('broccoli-funnel');

module.exports = {
  name: require('./package').name,
  options: {
    '@embroider/macros': {
      setOwnConfig: {
        includeTableComponents: true,
        includeSearchComponents: true,
      },
    },
  },

  included: function (app) {
    this._super.included.apply(this, arguments);

    let addonOptions = app.options[this.name];
    if (addonOptions) {
      let ownConfig = this.options['@embroider/macros'].setOwnConfig;
      Object.assign(ownConfig, addonOptions);
    }
  },

  treeForAddon: function (tree) {
    tree = this.filterUnneededComponents(tree);
    return this._super.treeForAddon.call(this, tree);
  },

  treeForApp: function (tree) {
    tree = this.filterUnneededComponents(tree);
    return this._super.treeForApp.call(this, tree);
  },

  filterUnneededComponents: function (tree) {
    let exclude = [];
    let ownConfig = this.options['@embroider/macros'].setOwnConfig;

    if (!ownConfig.includeTableComponents) {
      exclude.push('components/custom-subsidy-form-fields/**/*');
    }

    if (!ownConfig.includeSearchComponents) {
      exclude.push(
        'components/search-panel-fields/**/*',
        'components/rdf-input-fields/date-range.*',
        'components/rdf-input-fields/search.*'
      );
    }

    return new Funnel(tree, {
      exclude,
    });
  },
};
