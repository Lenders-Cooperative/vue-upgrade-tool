import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { updateVMenuSlot } from './v-menu';

it('should change outlined', () => {
  const code = `
<template>
    <v-menu>
        <template v-slot:activator="{ on, attrs }">
        <div class="btn-menu-button small" title="Action" v-bind="attrs" v-on="on">
            <div class="btn-menu-button__content">
            <span>Action</span>
            </div>
        </div>
        </template>
        <div>Test Menu</div>
    </v-menu>
</template>
`;
  expect(transform(code, 'file.vue', [updateVMenuSlot]).code).toMatchInlineSnapshot(`
    "
    <template>
        <v-menu>
            <template v-slot:activator="{ props }">
            <div class="btn-menu-button small" title="Action" v-bind="props">
                <div class="btn-menu-button__content">
                <span>Action</span>
                </div>
            </div>
            </template>
            <div>Test Menu</div>
        </v-menu>
    </template>
    "
  `);
});
