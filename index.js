'use strict';

module.exports = {
  name: require('./package').name,
  options: {
    babel: {
      plugins: [],
    },
  },

  init() {
    this._super.init.apply(this, arguments);
    this.maybeAddConcurrencyPlugin();
  },

  maybeAddConcurrencyPlugin() {
    const VersionChecker = require('ember-cli-version-checker');
    const checker = new VersionChecker(this.project);
    const dep = checker.for('ember-concurrency');

    if (dep.gte('4.0.0')) {
      // ember-concurrency v4+ requires a custom babel transform. Once we drop ember-concurrency v3 support we can remove this conditional registration.
      this.options.babel.plugins.push(
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      );
    }
  },
};
