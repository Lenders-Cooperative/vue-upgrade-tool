import type { CodemodPlugin } from 'vue-metamorph';

export const changeVExpansionProperties: CodemodPlugin = {
  type: 'codemod',
  name: 'change v-expainsion properties',

  transform({ scriptASTs, sfcAST, utils: { traverseScriptAST, traverseTemplateAST } }) {
    let transformCount = 0;

    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitLiteral(path) {
          return this.traverse(path);
        },
      });
    }

    if (sfcAST) {
      traverseTemplateAST(sfcAST, {
        enterNode(node) {
          if (node.type === 'VElement' && node.name === 'v-expansion-header') {
            node.rawName = 'v-expansion-title';
            node.name = 'v-expansion-title';
            transformCount++;
          } else if (node.type === 'VElement' && node.name === 'v-expansion-content') {
            node.rawName = 'v-expansion-text';
            node.name = 'v-expansion-text';
            transformCount++;
          }
        },
      });
    }

    return transformCount;
  },
};
