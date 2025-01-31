import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { updateVTextFieldPropsFormat } from './v-text-field';

it('should change outlined', () => {
  const code = `
<template>
  <div>
  <v-text-field outlined>
  </v-text-field>
  </div>
</template>
`;
  expect(transform(code, 'file.vue', [updateVTextFieldPropsFormat]).code).toMatchInlineSnapshot(`
    "
    <template>
      <div>
      <TextField variant="outlined">
      </TextField>
      </div>
    </template>
    "
  `);
});

it('should change dense', () => {
  const code = `
  <template>
    <div>
    <v-text-field dense>
    </v-text-field>
    </div>
  </template>
  script
  `;
  expect(transform(code, 'file.vue', [updateVTextFieldPropsFormat]).code).toMatchInlineSnapshot(`
    "
      <template>
        <div>
        <TextField density="compact">
        </TextField>
        </div>
      </template>
      script
      "
  `);
});
it('should change v-text-field and add import', () => {
  const code = `
  <template>
    <div>
    <v-text-field dense>
    </v-text-field>
    </div>
  </template>
  <script>
      import {Test} from '@lenders-cooperative/los-app-ui-component-lib'
      </script>
  `;
  expect(transform(code, 'file.vue', [updateVTextFieldPropsFormat]).code).toMatchInlineSnapshot(`
    "
      <template>
        <div>
        <TextField density="compact">
        </TextField>
        </div>
      </template>
      <script>
    import { Test, TextField } from '@lenders-cooperative/los-app-ui-component-lib';
    </script>
      "
  `);
});
it('should not change if TextField already exists', () => {
  const code = `
  <template>
        <div>
        <TextField density="compact">
        </TextField>
        </div>
      </template>
  <script>
      import { Test, TextField } from '@lenders-cooperative/los-app-ui-component-lib';
      </script>
  `;
  expect(transform(code, 'file.vue', [updateVTextFieldPropsFormat]).code).toMatchInlineSnapshot(`
    "
      <template>
            <div>
            <TextField density="compact">
            </TextField>
            </div>
          </template>
      <script>
    import { Test, TextField } from '@lenders-cooperative/los-app-ui-component-lib';
    </script>
      "
  `);
});
