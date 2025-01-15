import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeThisUidToDollarUid } from './this-uid';

it('should change this._uid to this.$.uid', () => {
  const code = `
<script>
export default {
  data() {
    return {
      _uid: '12345',
    };
  },
  mounted() {
    console.log(this._uid); // This should change to this.$.uid
  },
};
</script>
`;

  expect(transform(code, 'file.vue', [changeThisUidToDollarUid]).code).toMatchInlineSnapshot(`
    "
    <script>
    export default {
      data() {
        return {
          _uid: '12345',
        };
      },
      mounted() {
        console.log(this.$.uid); // This should change to this.$.uid
      },
    };
    </script>
    "
  `);
});

it('should change multiple occurrences of this._uid to this.$.uid', () => {
  const code = `
<script>
export default {
  mounted() {
    console.log(this._uid);
    this._uid = 'new-value';
    console.log(this._uid);
  },
};
</script>
`;

  expect(transform(code, 'file.vue', [changeThisUidToDollarUid]).code).toMatchInlineSnapshot(`
    "
    <script>
    export default {
      mounted() {
        console.log(this.$.uid);
        this.$.uid = 'new-value';
        console.log(this.$.uid);
      },
    };
    </script>
    "
  `);
});

it('should change this._uid to this.$.uid in different methods', () => {
  const code = `
<script>
export default {
  methods: {
    someMethod() {
      console.log(this._uid);
    },
  },
  mounted() {
    console.log(this._uid);
  },
};
</script>
`;

  expect(transform(code, 'file.vue', [changeThisUidToDollarUid]).code).toMatchInlineSnapshot(`
    "
    <script>
    export default {
      methods: {
        someMethod() {
          console.log(this.$.uid);
        },
      },
      mounted() {
        console.log(this.$.uid);
      },
    };
    </script>
    "
  `);
});

it('should change this._uid to this.$.uid in computed properties', () => {
  const code = `
<script>
export default {
  computed: {
    computedUid() {
      return this._uid;
    }
  },
  mounted() {
    console.log(this._uid);
  },
};
</script>
`;

  expect(transform(code, 'file.vue', [changeThisUidToDollarUid]).code).toMatchInlineSnapshot(`
    "
    <script>
    export default {
      computed: {
        computedUid() {
          return this.$.uid;
        }
      },
      mounted() {
        console.log(this.$.uid);
      },
    };
    </script>
    "
  `);
});

it('should not change anything if there is no this._uid', () => {
  const code = `
<script>
export default {
  mounted() {
    console.log('No _uid here');
  },
};
</script>
`;

  expect(transform(code, 'file.vue', [changeThisUidToDollarUid]).code).toMatchInlineSnapshot(`
    "
    <script>
    export default {
      mounted() {
        console.log('No _uid here');
      },
    };
    </script>
    "
  `);
});

it('should change this._uid to this.$.uid in data or props', () => {
  const code = `
<script>
export default {
  data() {
    return {
      _uid: '12345',
    };
  },
  props: {
    _uid: String,
  },
  mounted() {
    console.log(this._uid);
  },
};
</script>
`;

  expect(transform(code, 'file.vue', [changeThisUidToDollarUid]).code).toMatchInlineSnapshot(`
    "
    <script>
    export default {
      data() {
        return {
          _uid: '12345',
        };
      },
      props: {
        _uid: String,
      },
      mounted() {
        console.log(this.$.uid);
      },
    };
    </script>
    "
  `);
});

it('should not change anything if this._uid is used in the template', () => {
  const code = `
<template>
  <div>{{ this._uid }}</div>
</template>

<script>
export default {
  data() {
    return {
      _uid: '12345',
    };
  },
};
</script>
`;

  expect(transform(code, 'file.vue', [changeThisUidToDollarUid]).code).toMatchInlineSnapshot(`
    "
    <template>
      <div>{{ this._uid }}</div>
    </template>

    <script>
    export default {
      data() {
        return {
          _uid: '12345',
        };
      },
    };
    </script>
    "
  `);
});
