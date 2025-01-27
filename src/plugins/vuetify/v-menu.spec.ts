import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { updateVMenuSlot } from './v-menu';

it('should update attrs, on to props for v-menu', () => {
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

it('should update attrs, on to props for NavigationMenuItem', () => {
  const code = `
  <template>
    <NavigationMenuItem>
      <template v-slot:activator="{ attrs, on }">
        <a v-bind="attrs" v-on="on">
          hello
        </a>
      </template>
    </NavigationMenuItem>
  </template>
`;
  expect(transform(code, 'file.vue', [updateVMenuSlot]).code).toMatchInlineSnapshot(`
    "
      <template>
        <NavigationMenuItem>
          <template v-slot:activator="{ props }">
            <a v-bind="props">
              hello
            </a>
          </template>
        </NavigationMenuItem>
      </template>
    "
  `);
});

it('should update attrs, on to props for MultiCategoryMenu', () => {
  const code = `
  <template>
    <MultiCategoryMenu>
      <template v-slot:activator="{ attrs, on }">
        <a v-bind="attrs" v-on="on"> More </a>
      </template>
    </MultiCategoryMenu>
  </template>
`;
  expect(transform(code, 'file.vue', [updateVMenuSlot]).code).toMatchInlineSnapshot(`
    "
      <template>
        <MultiCategoryMenu>
          <template v-slot:activator="{ props }">
            <a v-bind="props"> More </a>
          </template>
        </MultiCategoryMenu>
      </template>
    "
  `);
});
