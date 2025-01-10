import type { CodemodPlugin } from 'vue-metamorph';

export const changeVuedraggableImportToVueDraggablePlus: CodemodPlugin = {
  type: 'codemod',
  name: 'change vuedraggable import to vue-draggable-plus',

  transform({ scriptASTs, utils: { traverseScriptAST } }) {
    let transformCount = 0;

    // Traverse the <script> ASTs to find and modify the import statement
    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitImportDeclaration(path) {
          const { node } = path;
          // Check if the import is from 'vuedraggable'
          if (node.source.value === 'vuedraggable') {
            // Change the import to the new vue-draggable-plus format
            node.source.value = 'vue-draggable-plus'; // Update import source
            node.specifiers = [
              {
                type: 'ImportSpecifier',
                imported: { name: 'vDraggable', type: 'Identifier' },
                local: { name: 'draggable', type: 'Identifier' },
              },
            ];
            transformCount++; // Increment the transformation count
          }
          this.traverse(path);
        },
      });
    }

    // Return the number of transformations made
    return transformCount;
  },
};
