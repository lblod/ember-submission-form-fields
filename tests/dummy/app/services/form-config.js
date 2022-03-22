import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FormConfigService extends Service {
  @tracked isReadOnly = false;
}
