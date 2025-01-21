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
      <v-text-field variant="outlined">
      </v-text-field>
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
  `;
  expect(transform(code, 'file.vue', [updateVTextFieldPropsFormat]).code).toMatchInlineSnapshot(`
    "
      <template>
        <div>
        <v-text-field density="compact">
        </v-text-field>
        </div>
      </template>
      "
  `);
});
