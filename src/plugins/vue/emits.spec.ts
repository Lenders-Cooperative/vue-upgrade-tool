import { transform } from 'vue-metamorph';
import { it, expect } from 'vitest';
import { emitsNonSfcPlugin, emitsSfcPlugin } from './emits';

it('non-sfc', () => {
  const code = `
const first = defineComponent({
  methods: {
    a() {
      this.$emit('foo');
    },
    b() {
      this.$emit('bar');
    }
  }
});

const second = defineComponent({
  methods: {
    c() {
      this.$emit('baz');
    },
    d() {
      this.$emit('qux');
    }
  }
});
`;

  expect(transform(code, 'file.ts', [emitsNonSfcPlugin]).code).toMatchInlineSnapshot(`
    "const first = defineComponent({
      methods: {
        a() {
          this.$emit('foo');
        },
        b() {
          this.$emit('bar');
        }
      },

      emits: ['foo', 'bar'],
    });

    const second = defineComponent({
      methods: {
        c() {
          this.$emit('baz');
        },
        d() {
          this.$emit('qux');
        }
      },

      emits: ['baz', 'qux'],
    });
    "
  `);
});

it('sfc', () => {
  const code = `
<template>
  <button @click="$emit('foo')">Test</button>
</template>
<script lang="ts">
export default defineComponent({
  methods: {
    a() {
      this.$emit('bar');
    },
    b() {
      this.$emit('baz');
    },
  },
})
</script>
`;

  expect(transform(code, 'file.vue', [emitsSfcPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <button @click="$emit('foo')">Test</button>
    </template>
    <script lang="ts">
    export default defineComponent({
      methods: {
        a() {
          this.$emit('bar');
        },
        b() {
          this.$emit('baz');
        },
      },

      emits: ['foo', 'bar', 'baz'],
    })
    </script>
    "
  `);
});

it('with existing emits property', () => {
  const code = `
<template>
  <button @click="$emit('foo')">Test</button>
</template>
<script lang="ts">
export default defineComponent({
  methods: {
    a() {
      this.$emit('bar');
    },
    b() {
      this.$emit('baz');
    },
  },
  emits: ['bar']
})
</script>
`;

  expect(transform(code, 'file.vue', [emitsSfcPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <button @click="$emit('foo')">Test</button>
    </template>
    <script lang="ts">
    export default defineComponent({
      methods: {
        a() {
          this.$emit('bar');
        },
        b() {
          this.$emit('baz');
        },
      },
      emits: ['bar', 'foo', 'baz']
    })
    </script>
    "
  `);
});
