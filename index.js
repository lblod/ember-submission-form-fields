'use strict';

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
};
