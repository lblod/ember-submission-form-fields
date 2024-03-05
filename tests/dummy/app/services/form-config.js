import Service, { service } from '@ember/service';

export default class FormConfigService extends Service {
  @service router;

  get isReadOnly() {
    return this.router.currentRoute.queryParams.readOnly === 'true';
  }
}
