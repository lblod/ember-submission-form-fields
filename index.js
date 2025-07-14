'use strict';

module.exports = {
  name: require('./package').name,
  options: {
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
    '@embroider/macros': {
      setOwnConfig: {
        helpTextBelowLabel: false,
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
};
