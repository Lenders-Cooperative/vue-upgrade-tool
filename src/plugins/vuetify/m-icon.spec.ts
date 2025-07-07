import { describe, it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeMDIIconText } from './m-icon';

function runTransform(template: string) {
  const code = `<template>${template}</template>`;
  return transform(code, 'file.vue', [changeMDIIconText]).code;
}

describe('changeMDIIconText', () => {
  it('transforms mdi-* text inside <v-icon>', () => {
    const result = runTransform('<v-icon>mdi-sync</v-icon>');
    expect(result).toMatchInlineSnapshot('"<template><v-icon>mdi:mdi-sync</v-icon></template>"');
  });

  it('does not transform mdi-* text outside <v-icon>', () => {
    const result = runTransform('<span>mdi-sync</span>');
    expect(result).toMatchInlineSnapshot('"<template><span>mdi-sync</span></template>"');
  });

  it('transforms mdi-* in v-icon attribute value', () => {
    const result = runTransform('<v-icon icon="mdi-home"></v-icon>');
    expect(result).toMatchInlineSnapshot('"<template><v-icon icon="mdi:mdi-home"></v-icon></template>"');
  });

  it('does not transform mdi-* in attribute outside <v-icon>', () => {
    const result = runTransform('<span icon="mdi-home"></span>');
    expect(result).toMatchInlineSnapshot('"<template><span icon="mdi-home"></span></template>"');
  });

  it('transforms multiple mdi-* in one template', () => {
    const result = runTransform('<v-icon>mdi-foo</v-icon><v-icon icon="mdi-bar"></v-icon>');
    expect(result).toMatchInlineSnapshot(
      '"<template><v-icon>mdi:mdi-foo</v-icon><v-icon icon="mdi:mdi-bar"></v-icon></template>"',
    );
  });

  it('ignores non-mdi icons', () => {
    const result = runTransform('<v-icon>fa-home</v-icon>');
    expect(result).toMatchInlineSnapshot('"<template><v-icon>fa-home</v-icon></template>"');
  });
});
