import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'dummy/config/environment';
import { mockRequestsWorker } from 'dummy/mocks/worker';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

mockRequestsWorker.start({
  onUnhandledRequest: 'bypass',
});
loadInitializers(App, config.modulePrefix);
