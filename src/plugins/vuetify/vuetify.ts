import type { CodemodPlugin } from 'vue-metamorph';

export const changeVTabItemToVWindowItem: CodemodPlugin = {
  type: 'codemod',
  name: 'change v-tab-item to v-window-item',

  transform({ scriptASTs, sfcAST, utils: { traverseScriptAST, traverseTemplateAST } }) {
    let transformCount = 0;

    // Traverse the <script> ASTs and check if there are any relevant string literals in code (not needed for this case)
    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitLiteral(path) {
          // If you want to check/modify string literals inside the <script> block, do it here
          // (but in this case, it's not necessary since we care about the template part)
          return this.traverse(path);
        },
      });
    }

    if (sfcAST) {
      // Traverse the template AST and look for <v-tab-item> elements
      traverseTemplateAST(sfcAST, {
        enterNode(node) {
          if (node.type === 'VElement' && node.name === 'v-tab-item') {
            // Mutate the node to change the tag from v-tab-item to v-window-item
            node.rawName = 'v-window-item';
            node.name = 'v-window-item';
            transformCount++; // Increment the count of transformations made
          } else if (node.type === 'VElement' && node.name === 'v-tabs-item') {
            // Mutate the node to change the tag from v-tabs-item to v-window
            node.rawName = 'v-window';
            node.name = 'v-window';
            transformCount++; // Increment the count of transformations made
          }
        },
      });
    }

    return transformCount; // Return the number of transformations made
  },
};
