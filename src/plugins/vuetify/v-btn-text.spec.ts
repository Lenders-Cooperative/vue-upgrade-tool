import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeVBtnTextToVariant } from './v-btn-text';

it('should change v-btn text to v-btn variant="text"', () => {
  const code = `
<template>
  <v-btn text>Click Me</v-btn>
</template>
`;
  expect(transform(code, 'file.vue', [changeVBtnTextToVariant]).code).toMatchInlineSnapshot(`
    "
    <template>
      <v-btn variant="text">Click Me</v-btn>
    </template>
    "
  `);
});

it('should ignore v-btn with already set variant', () => {
  const code = `
<template>
  <v-btn variant="text">Click Me</v-btn>
</template>
`;
  expect(transform(code, 'file.vue', [changeVBtnTextToVariant]).code).toMatchInlineSnapshot(`
    "
    <template>
      <v-btn variant="text">Click Me</v-btn>
    </template>
    "
  `);
});

it('should transform multiple v-btn elements', () => {
  const code = `
<template>
  <v-btn text>First Button</v-btn>
  <v-btn text>Second Button</v-btn>
</template>
`;
  expect(transform(code, 'file.vue', [changeVBtnTextToVariant]).code).toMatchInlineSnapshot(`
    "
    <template>
      <v-btn variant="text">First Button</v-btn>
      <v-btn variant="text">Second Button</v-btn>
    </template>
    "
  `);
});

it('should not transform non v-btn elements', () => {
  const code = `
<template>
  <div>Some content</div>
  <span>Another content</span>
</template>
`;
  expect(transform(code, 'file.vue', [changeVBtnTextToVariant]).code).toMatchInlineSnapshot(`
    "
    <template>
      <div>Some content</div>
      <span>Another content</span>
    </template>
    "
  `);
});

it('should handle v-btn with other props', () => {
  const code = `
<template>
  <v-btn text color="primary">Click Me</v-btn>
</template>
`;
  expect(transform(code, 'file.vue', [changeVBtnTextToVariant]).code).toMatchInlineSnapshot(`
    "
    <template>
      <v-btn color="primary" variant="text">Click Me</v-btn>
    </template>
    "
  `);
});

it('should handle multiple props with v-btn text', () => {
  const code = `
<template>
  <v-btn text color="secondary" @click="handleClick">Click Me</v-btn>
</template>
`;
  expect(transform(code, 'file.vue', [changeVBtnTextToVariant]).code).toMatchInlineSnapshot(`
    "
    <template>
      <v-btn color="secondary" @click="handleClick" variant="text">Click Me</v-btn>
    </template>
    "
  `);
});
