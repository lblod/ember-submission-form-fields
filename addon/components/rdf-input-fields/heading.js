import Component from '@glimmer/component';

export default class RdfHeadingComponent extends Component {
  get skin() {
    return this.args.field.options.skin;
  }

  get level() {
    return this.args.field.options.level;
  }
}
