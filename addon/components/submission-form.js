import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fieldsForForm }  from '@lblod/submission-form-helpers';
import { createPropertyTreeFromFields } from '../utils/model-factory';
import { A } from '@ember/array';
import { guidFor } from '@ember/object/internals';

export default class SubmissionFormComponent extends Component {
  @tracked fields = A()

  observerLabel = `form-root-${guidFor(this)}`

  constructor() {
    super(...arguments);
    this.args.formStore.registerObserver(() => {
      this.getPropertyGroups( this.args.formStore,
        this.args.graphs.formGraph,
        this.args.graphs.sourceGraph,
        this.args.sourceNode,
        this.args.graphs.metaGraph
      );
    }, this.observerLabel);

    this.getPropertyGroups( this.args.formStore,
      this.args.graphs.formGraph,
      this.args.graphs.sourceGraph,
      this.args.sourceNode,
      this.args.graphs.metaGraph
    );
  }

  willDestroy(){
    this.args.formStore.deregisterObserver(this.observerLabel);
  }

  getPropertyGroups(store, formGraph, sourceGraph, sourceNode, metaGraph) {
    let fieldUris = fieldsForForm( this.args.form, {
      store,
      formGraph,
      sourceGraph,
      sourceNode,
      metaGraph
    });

    const propertyGroups = createPropertyTreeFromFields( fieldUris, { store, formGraph });
    let updatedFields = [];
    propertyGroups.forEach(p => updatedFields = [...updatedFields, ...p.fields]);

    //Procedure to render only new fields. So we don't rerender the full form.

    //Remove obsolete fields
    const toRemove = [];
    this.fields.forEach(field => {
      if(!updatedFields.find(uField => uField.uri.equals(field.uri))){
        toRemove.push(field);
      }
    });
    this.fields.removeObjects(toRemove);

    //Add the new fields, keep the existing ones
    updatedFields.forEach((field, i) => {
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
