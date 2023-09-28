import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CustomAccordionComponent extends Component {
  @tracked isAccordionVisible = false;

  @action
  toggleAccordion() {
    this.isAccordionVisible = !this.isAccordionVisible;
  }
}
