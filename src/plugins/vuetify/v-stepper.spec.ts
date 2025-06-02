import { it, describe, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeVStepperProperties } from './v-stepper';

const run = (code: string) => transform(code, 'file.vue', [changeVStepperProperties]).code;

describe('changeVStepperProperties plugin', () => {
  it('should convert step attribute to :value binding and rename tag', () => {
    const code = `
<template>
  <div>
    <v-stepper-step step="val" />
  </div>
</template>`;
    expect(run(code)).toMatchInlineSnapshot(`
      "
      <template>
        <div>
          <v-stepper-item :value="val" />
        </div>
      </template>"
    `);
  });

  it('should convert numeric string to number', () => {
    const code = `
<template>
  <v-stepper-step step="3" />
</template>`;
    expect(run(code)).toMatchInlineSnapshot(`
      "
      <template>
        <v-stepper-item :value="3" />
      </template>"
    `);
  });

  it('should keep non-target elements unchanged', () => {
    const code = `
<template>
  <div><not-step step="val" /></div>
</template>`;
    expect(run(code)).toMatchInlineSnapshot(`
      "
      <template>
        <div><not-step step="val" /></div>
      </template>"
    `);
  });

  it('should preserve other attributes', () => {
    const code = `
<template>
  <v-stepper-step step="1" label="Intro" />
</template>`;
    expect(run(code)).toMatchInlineSnapshot(`
      "
      <template>
        <v-stepper-item :value="1" label="Intro" />
      </template>"
    `);
  });

  it('should do nothing if no step attribute', () => {
    const code = `
<template>
  <v-stepper-step label="Intro" />
</template>`;
    expect(run(code)).toMatchInlineSnapshot(`
      "
      <template>
        <v-stepper-item label="Intro" />
      </template>"
    `);
  });
});
