import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { convertFiltersToFunctionCalls } from './filters-replace';

it('should change from filters to concat function calls', () => {
  const code = `
<template>
  <div>{{ test | capitalizeAll | orDashes }}</div>
</template>
`;
  expect(transform(code, 'file.vue', [convertFiltersToFunctionCalls]).code).toMatchInlineSnapshot(`
    "
    <template>
  <div>{{ orDashes(capitalizeAll(test)) }}</div>
</template>
    "
  `);
});
it('with obj value', () => {
  const code = `
<template>
  <div>{{ test.value | capitalizeAll | orDashes }}</div>
</template>
`;
  expect(transform(code, 'file.vue', [convertFiltersToFunctionCalls]).code).toMatchInlineSnapshot(`
    "
    <template>
  <div>{{ orDashes(capitalizeAll(test.value)) }}</div>
</template>
    "
  `);
});
it('with obj value nested', () => {
  const code = `
<template>
  <div>{{ test.value.test | capitalizeAll | orDashes }}</div>
</template>
`;
  expect(transform(code, 'file.vue', [convertFiltersToFunctionCalls]).code).toMatchInlineSnapshot(`
    "
    <template>
  <div>{{ orDashes(capitalizeAll(test.value.test)) }}</div>
</template>
    "
  `);
});
it('with boolean value', () => {
  const code = `
<template>
  <div>{{ false | capitalizeAll | orDashes }}</div>
</template>
`;
  expect(transform(code, 'file.vue', [convertFiltersToFunctionCalls]).code).toMatchInlineSnapshot(`
    "
    <template>
  <div>{{ orDashes(capitalizeAll(false)) }}</div>
</template>
    "
  `);
});
it('passes along args', () => {
  const code = `
<template>
  <div>{{ false | dateTime(false, true) | orDashes }}</div>
</template>
`;
  expect(transform(code, 'file.vue', [convertFiltersToFunctionCalls]).code).toMatchInlineSnapshot(`
    "
    <template>
  <div>{{ orDashes(dateTime(false, false, true)) }}</div>
</template>
    "
  `);
});
it('aceepts conditional values', () => {
  const code = `
<template>
  <div>{{ myvalue ? 'tes' : 'test' | dateTime(false, true) | orDashes }}</div>
</template>
`;
  expect(transform(code, 'file.vue', [convertFiltersToFunctionCalls]).code).toMatchInlineSnapshot(`
    "
    <template>
  <div>{{ orDashes(dateTime(myvalue ? 'tes' : 'test', false, true)) }}</div>
</template>
    "
  `);
});
it('aceepts function values', () => {
  const code = `
<template>
  <div>{{ myFunc(myvalue) | dateTime(false, true) | orDashes }}</div>
</template>
`;
  expect(transform(code, 'file.vue', [convertFiltersToFunctionCalls]).code).toMatchInlineSnapshot(`
    "
    <template>
  <div>{{ orDashes(dateTime(myFunc(myvalue), false, true)) }}</div>
</template>
    "
  `);
});
