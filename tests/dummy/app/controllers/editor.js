import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class EditorController extends Controller {
  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent('test');
  }
}
