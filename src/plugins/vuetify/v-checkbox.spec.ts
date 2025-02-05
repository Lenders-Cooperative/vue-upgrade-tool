import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { updateVCheckboxToCheckbox } from './v-checkbox';

it('should change v-checkbox and add import', () => {
  const code = `
  <template>
    <div>
    <v-checkbox>
    </v-checkbox>
    </div>
  </template>
  <script>
      import {Test} from '@lenders-cooperative/los-app-ui-component-lib'
      </script>
  `;
  expect(transform(code, 'file.vue', [updateVCheckboxToCheckbox]).code).toMatchInlineSnapshot(`
    "
      <template>
        <div>
        <CheckBox>
        </CheckBox>
        </div>
      </template>
      <script>
    import { Test, CheckBox } from '@lenders-cooperative/los-app-ui-component-lib';
    </script>
      "
  `);
});
it('should not change if CheckBox already exists', () => {
  const code = `
  <template>
        <div>
        <CheckBox>
        </CheckBox>
        </div>
      </template>
  <script>
      import { Test, CheckBox } from '@lenders-cooperative/los-app-ui-component-lib';
      </script>
  `;
  expect(transform(code, 'file.vue', [updateVCheckboxToCheckbox]).code).toMatchInlineSnapshot(`
    "
      <template>
            <div>
            <CheckBox>
            </CheckBox>
            </div>
          </template>
      <script>
    import { Test, CheckBox } from '@lenders-cooperative/los-app-ui-component-lib';
    </script>
      "
  `);
});
