import Controller from '@ember/controller';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class EditorController extends Controller {
  @task
  *save() {
    console.log('------------------')
    console.log('Datastore')
    console.log(this.editor.datastore);
    console.log('htmlContent')
    console.log(this.editor.htmlContent);
    console.log('------------------')
  }

  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent('test');
  }
}
