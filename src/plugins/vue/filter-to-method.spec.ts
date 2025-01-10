import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeFilterAccessToMethod } from './filter-to-method';

it('should change from this.$options.filters.<method> to this.<method>', () => {
  const code = `
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    methods: {
      test() {
        const result = this.$options.filters.capitalizeAll(this.testString);
      }
    },
    data() {
      return { testString: 'some_test_string' };
    },
  });
</script>
`;

  expect(transform(code, 'file.vue', [changeFilterAccessToMethod]).code).toMatchInlineSnapshot(`
    "
    <script>
    import { defineComponent } from 'vue';

    export default defineComponent({
      methods: {
        test() {
          const result = this.capitalizeAll(this.testString);
        }
      },
      data() {
        return { testString: 'some_test_string' };
      },
    });
    </script>
    "
  `);
});

it('should handle method call with arguments', () => {
  const code = `
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    methods: {
      test() {
        const result = this.$options.filters.formatDate(this.date, 'long');
      }
    },
    data() {
      return { date: new Date() };
    },
  });
</script>
`;

  expect(transform(code, 'file.vue', [changeFilterAccessToMethod]).code).toMatchInlineSnapshot(`
    "
    <script>
    import { defineComponent } from 'vue';

    export default defineComponent({
      methods: {
        test() {
          const result = this.formatDate(this.date, 'long');
        }
      },
      data() {
        return { date: new Date() };
      },
    });
    </script>
    "
  `);
});

it('should transform filters when there is a nested object value', () => {
  const code = `
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    methods: {
      test() {
        const result = this.$options.filters.capitalizeAll(this.user.name);
      }
    },
    data() {
      return { user: { name: 'John Doe' } };
    },
  });
</script>
`;

  expect(transform(code, 'file.vue', [changeFilterAccessToMethod]).code).toMatchInlineSnapshot(`
    "
    <script>
    import { defineComponent } from 'vue';

    export default defineComponent({
      methods: {
        test() {
          const result = this.capitalizeAll(this.user.name);
        }
      },
      data() {
        return { user: { name: 'John Doe' } };
      },
    });
    </script>
    "
  `);
});

it('should not change if the expression does not match this.$options.filters.<method>', () => {
  const code = `
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    methods: {
      test() {
        const result = this.someOtherObject.someMethod();
      }
    },
    data() {
       return { user: { name: 'John Doe' } };
    },
  });
</script>
`;

  expect(transform(code, 'file.vue', [changeFilterAccessToMethod]).code).toMatchInlineSnapshot(`
    "
    <script>
    import { defineComponent } from 'vue';

    export default defineComponent({
      methods: {
        test() {
          const result = this.someOtherObject.someMethod();
        }
      },
      data() {
         return { user: { name: 'John Doe' } };
      },
    });
    </script>
    "
  `);
});

it('should handle a boolean value with filters', () => {
  const code = `
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    methods: {
      test() {
        const result = this.$options.filters.toggleBoolean(true);
      }
    },
    data() {
      return { someBoolean: true };
    },
  });
</script>
`;

  expect(transform(code, 'file.vue', [changeFilterAccessToMethod]).code).toMatchInlineSnapshot(`
    "
    <script>
    import { defineComponent } from 'vue';

    export default defineComponent({
      methods: {
        test() {
          const result = this.toggleBoolean(true);
        }
      },
      data() {
        return { someBoolean: true };
      },
    });
    </script>
    "
  `);
});

it('should work with a method call on an object property', () => {
  const code = `
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    methods: {
      test() {
        const result = this.$options.filters.formatName(this.user.firstName, this.user.lastName);
      }
    },
    data() {
      return { user: { firstName: 'John', lastName: 'Doe' } };
    },
  });
</script>
`;

  expect(transform(code, 'file.vue', [changeFilterAccessToMethod]).code).toMatchInlineSnapshot(`
    "
    <script>
    import { defineComponent } from 'vue';

    export default defineComponent({
      methods: {
        test() {
          const result = this.formatName(this.user.firstName, this.user.lastName);
        }
      },
      data() {
        return { user: { firstName: 'John', lastName: 'Doe' } };
      },
    });
    </script>
    "
  `);
});
