import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeVTabItemToVWindowItem } from './v-tab-item';

it('should change v-tab-item', () => {
  const code = `
<template>
  <div>
    <v-tab-item></v-tab-item>
  </div>
</template>
`;
  expect(transform(code, 'file.vue', [changeVTabItemToVWindowItem]).code).toMatchInlineSnapshot(`
    "
    <template>
      <div>
        <v-window-item></v-window-item>
      </div>
    </template>
    "
  `);
});
it('should change v-tabs-item', () => {
  const code = `
<template>
  <div>
    <v-tabs-item></v-tabs-item>
  </div>
</template>
`;
  expect(transform(code, 'file.vue', [changeVTabItemToVWindowItem]).code).toMatchInlineSnapshot(`
    "
    <template>
      <div>
        <v-window></v-window>
      </div>
    </template>
    "
  `);
});
