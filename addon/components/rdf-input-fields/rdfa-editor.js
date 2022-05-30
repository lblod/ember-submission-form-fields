import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfaEditorComponent extends SimpleInputFieldComponent {
  inputId = 'richtext-' + guidFor(this);
  plugins = ['citaten-plugin', 'standard-template'];
  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent(this.value ? this.value : '');
  }

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const editorValue = this.editor.htmlContent;
    super.updateValue(editorValue);
  }
}
