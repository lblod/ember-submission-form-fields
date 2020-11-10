import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { getChildrenForPropertyGroup } from '../utils/model-factory';
import { guidFor } from '@ember/object/internals';
import { removeTriples } from '@lblod/submission-form-helpers';
import { isPropertyGroup } from '../helpers/is-property-group';

export default class SubmissionFormPropertyGroupComponent extends Component {

  @tracked children = A();

  observerLabel = `property-group-${guidFor(this)}`;

  constructor() {
    super(...arguments);
    // this.register();

    this.update(
      this.args.group,
      {
        form: this.args.form,
        store: this.args.formStore,
        graphs: this.args.graphs,
        node: this.args.sourceNode,
      },
      {
        cacheConditionals: this.args.cacheConditionals,
      },
    );
  }

  willDestroy() {
    this.deregister();
  }

  register() {
    this.args.formStore.registerObserver(() => {
      this.update(
        this.args.group,
        {
          form: this.args.form,
          store: this.args.formStore,
          graphs: this.args.graphs,
          node: this.args.sourceNode,
        },
        {
          cacheConditionals: this.args.cacheConditionals,
        },
      );
    }, this.observerLabel);
  }

  deregister() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }


  update(group, {form, store, graphs, node}, options) {
    this.deregister(); // NOTE: to prevent calling ourself up again with changes

    console.log(`DEBUG: started updating PropertyGroup "${group.description}" ...`);
    // 1) retrieve the to be rendered children (!!could be nested property-groups or fields) for this property-group
    const children = getChildrenForPropertyGroup(group, {form, store, graphs, node});
    console.log(`DEBUG: ${children.length} found that should be rendered (current state)`);

    // 2) calculate to be removed
    const deletes = this.children.filter(rendered => !children.find(child => child.uri.equals(rendered.uri)));
    console.log(`DEBUG: ${deletes.length} children marked for removal`);

    // 3) calculate children to be inserted
    const inserts = children.map((child, index) => {
      return {index, value: child};
    }).filter(insert => !!!this.children.find(rendered => rendered.uri.equals(insert.value.uri)));
    console.log(`DEBUG: ${inserts.length} children found that are not yet rendered `);

    // 4) update the values in the rdflib-store
    if (deletes.length && !options.cacheConditionals) {
      deletes.filter(child => !isPropertyGroup(child.displayType)) // NOTE only fields can contain values
        .forEach((field) => {
          removeTriples({store, path: field.rdflibPath, sourceNode: node, sourceGraph: graphs.sourceGraph});
        });
    }
    // 5) update the rendered children
    this.children.removeObjects(deletes);
    inserts.forEach(insert => this.children.replace(insert.index, 1, [insert.value]));

    this.register(); // NOTE: to make sure we get notified on user input
  }
}
