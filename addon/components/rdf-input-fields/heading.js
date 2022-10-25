import Component from '@glimmer/component';

export default class RdfHeadingComponent extends Component {
  get titleSkin() {
    return this.args.field.options.skin || '6';
  }
}
