import Component from '@glimmer/component';

export default class PropertyGroupDefaultComponent extends Component {
  get level() {
    return this.args.level || 1;
  }

  get titleLevel() {
    return `${this.level}`;
  }

  get titleSkin() {
    return `${this.level + 1}`;
  }

  get nextLevel() {
    return this.level + 1;
  }
}
