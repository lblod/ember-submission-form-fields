import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | custom-subsidy-form-fields/climate-subsidy-costs-table/table-row-algemene-doelstellingen', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CustomSubsidyFormFields::ClimateSubsidyCostsTable::TableRowAlgemeneDoelstellingen />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <CustomSubsidyFormFields::ClimateSubsidyCostsTable::TableRowAlgemeneDoelstellingen>
        template block text
      </CustomSubsidyFormFields::ClimateSubsidyCostsTable::TableRowAlgemeneDoelstellingen>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
