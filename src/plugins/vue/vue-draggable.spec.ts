import { it, expect } from 'vitest';
import { transform } from 'vue-metamorph';
import { changeVuedraggableImportToVueDraggablePlus } from './vue-draggable';

it('should update vue draggable import ', () => {
  const code = `
<script>
import draggable from 'vuedraggable';
export default defineComponent({
  data() {
    return {
      test: 'some_test_string',
    };
  },
});
</script>

`;
  expect(transform(code, 'file.vue', [changeVuedraggableImportToVueDraggablePlus]).code).toMatchInlineSnapshot(`
    "
    <script>
    import { vDraggable as draggable } from 'vue-draggable-plus';
    export default defineComponent({
      data() {
        return {
          test: 'some_test_string',
        };
      },
    });
    </script>

    "
  `);
});
