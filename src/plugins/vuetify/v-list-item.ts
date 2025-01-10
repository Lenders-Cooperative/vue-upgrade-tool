import type { CodemodPlugin } from 'vue-metamorph';

export const changeVListItemGroupToVListGroup: CodemodPlugin = {
  type: 'codemod',
  name: 'change v-list-item-group to v-list-group',

  transform({ scriptASTs, sfcAST, utils: { traverseScriptAST, traverseTemplateAST } }) {
    let transformCount = 0;

    // Traverse the <script> ASTs and check if there are any relevant string literals in code
    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitLiteral(path) {
          // We don't need to modify string literals here for this transformation.
          return this.traverse(path);
        },
      });
    }

    // If there's an SFC AST, traverse the template to find <v-list-item-group>
    if (sfcAST) {
      traverseTemplateAST(sfcAST, {
        enterNode(node) {
          if (node.type === 'VElement' && node.name === 'v-list-item-group') {
            // Mutate the node to change the tag from v-list-item-group to v-list-group
            node.rawName = 'v-list-group';
            node.name = 'v-list-group';
            transformCount++; // Increment the count of transformations made
          }
        },
      });
    }

    return transformCount; // Return the number of transformations made
  },
};
