import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeVExpansionProperties } from './v-expansion';

const run = (code: string) => transform(code, 'file.vue', [changeVExpansionProperties]).code;

it('should change v-expansion-header', () => {
  const code = `
<template>
  <div>
    <v-expansion-header></v-expansion-header>
  </div>
</template>
`;
  expect(run(code)).toMatchInlineSnapshot(`
    "
    <template>
      <div>
        <v-expansion-title></v-expansion-title>
      </div>
    </template>
    "
  `);
});
it('should change v-expansion-content', () => {
  const code = `
<template>
  <div>
    <v-expansion-content></v-expansion-content>
  </div>
</template>
`;
  expect(run(code)).toMatchInlineSnapshot(`
    "
    <template>
      <div>
        <v-expansion-text></v-expansion-text>
      </div>
    </template>
    "
  `);
});
