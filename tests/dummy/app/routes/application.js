import Route from '@ember/routing/route';
import { mockRequestsWorker } from 'dummy/mocks/worker';

export default class ApplicationRoute extends Route {
  // beforeModel() {
  //   return mockRequestsWorker.start({
  //     onUnhandledRequest: 'bypass',
  //   });
  // }
}
