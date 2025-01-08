import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { convertElementWithVForToTemplate } from './v-for';

it('should add template and move vfor to template tag', () => {
  const code = `
<template>
    <div v-for="item in items" :key="item.id">
      {{ item }}
    </div>
</template>
`;
  expect(transform(code, 'file.vue', [convertElementWithVForToTemplate]).code).toMatchInlineSnapshot(`
    "
    <template>
        <template v-for="item in items" :key="item.id"><div>
          {{ item }}
        </div></template>
    </template>
    "
  `);
});
