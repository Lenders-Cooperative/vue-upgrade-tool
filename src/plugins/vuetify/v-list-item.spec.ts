import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeVListItemGroupToVListGroup } from './v-list-item';

it('should change v-list-item-group to v-list-group', () => {
  const code = `
<template>
  <v-list-item-group>
    <v-list-item>
      <span>Item 1</span>
    </v-list-item>
  </v-list-item-group>
</template>
`;

  expect(transform(code, 'file.vue', [changeVListItemGroupToVListGroup]).code).toMatchInlineSnapshot(`
    "
    <template>
      <v-list-group>
        <v-list-item>
          <span>Item 1</span>
        </v-list-item>
      </v-list-group>
    </template>
    "
  `);
});
