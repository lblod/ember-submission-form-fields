import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfInputFieldsRichTextComponent extends SimpleInputFieldComponent {
  inputId = 'richtext-' + guidFor(this);

  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent('test');
  }

  @action
  updateValue(e) {
    console.log('saving');
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const editorValue = this.editor.htmlContent;
    super.updateValue(editorValue);
  }
}
