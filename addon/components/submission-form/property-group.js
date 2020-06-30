import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {A} from '@ember/array';
import {fieldsForForm} from "@lblod/submission-form-helpers";
import {createPropertyTreeFromFields} from "../../utils/model-factory";
import {guidFor} from '@ember/object/internals';

export default class SubmissionFormPropertyGroupComponent extends Component {
  @tracked fields = A();

  observerLabel = `property-group-${guidFor(this)}`

  constructor() {
    super(...arguments);
    this.args.formStore.registerObserver(() => {
      this.update(
        this.args.group,
        this.args.formStore,
        this.args.graphs,
        this.args.sourceNode
      );
    }, this.observerLabel);

    this.update(
      this.args.group,
      this.args.formStore,
      this.args.graphs,
      this.args.sourceNode
    );
  }

  willDestroy() {
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  update(group, store, graphs, sourceNode) {
    let fieldUris = fieldsForForm(this.args.form, {
      store,
      formGraph: graphs.formGraph,
      sourceGraph: graphs.sourceGraph,
      metaGraph: graphs.metaGraph,
      sourceNode
    });

    const updated = createPropertyTreeFromFields(fieldUris, {store, formGraph: graphs.formGraph})
      .find(g => g.uri.equals(group.uri));
    this.updateFields(updated);
  }

  updateFields(group) {
    //Remove obsolete fields
    const toRemove = [];
    this.fields.forEach(field => {
      if(!group.fields.find(uField => uField.uri.equals(field.uri))){
        toRemove.push(field);
      }
    });
    this.fields.removeObjects(toRemove);

    //Add the new fields, keep the existing ones
    group.fields.forEach((field, i) => {
      const existingField = this.fields.find(eField => eField.uri.equals(field.uri));
      if(existingField){
        this.fields.replace(i, 1, [existingField]);
      }
      else{
        this.fields.replace(i, 1, [field]);
      }
    });
  }
}
