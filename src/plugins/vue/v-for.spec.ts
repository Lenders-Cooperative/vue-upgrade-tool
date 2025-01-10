import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { convertElementWithVForToTemplate } from './v-for';

it('should add template and move v-for to template tag', () => {
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

it('should ignore template if already has v-for', () => {
  const code = `
<template>
    <template v-for="item in items" :key="item.id">
      {{ item }}
    </template>
</template>
`;
  expect(transform(code, 'file.vue', [convertElementWithVForToTemplate]).code).toMatchInlineSnapshot(`
    "
    <template>
        <template v-for="item in items" :key="item.id">
          {{ item }}
        </template>
    </template>
    "
  `);
});

it('should transform multiple elements with v-for', () => {
  const code = `
<template>
    <div v-for="item in items" :key="item.id">
      {{ item }}
    </div>
    <span v-for="text in texts" :key="text">
      {{ text }}
    </span>
</template>
`;
  expect(transform(code, 'file.vue', [convertElementWithVForToTemplate]).code).toMatchInlineSnapshot(`
    "
    <template>
        <template v-for="item in items" :key="item.id"><div>
          {{ item }}
        </div></template>
        <template v-for="text in texts" :key="text"><span>
          {{ text }}
        </span></template>
    </template>
    "
  `);
});

it('should not transform elements without v-for directive', () => {
  const code = `
<template>
    <div>
      {{ item }}
    </div>
    <span>
      {{ text }}
    </span>
</template>
`;
  expect(transform(code, 'file.vue', [convertElementWithVForToTemplate]).code).toMatchInlineSnapshot(`
    "
    <template>
        <div>
          {{ item }}
        </div>
        <span>
          {{ text }}
        </span>
    </template>
    "
  `);
});

it('should handle nested elements with v-for', () => {
  const code = `
<template>
    <div v-for="item in items" :key="item.id">
      <span>{{ item.text }}</span>
    </div>
</template>
`;
  expect(transform(code, 'file.vue', [convertElementWithVForToTemplate]).code).toMatchInlineSnapshot(`
    "
    <template>
        <template v-for="item in items" :key="item.id"><div>
          <span>{{ item.text }}</span>
        </div></template>
    </template>
    "
  `);
});

it('should handle v-for with bind:key directive', () => {
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
