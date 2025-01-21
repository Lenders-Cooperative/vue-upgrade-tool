import type { CodemodPlugin } from 'vue-metamorph';

export const updateVTextFieldPropsFormat: CodemodPlugin = {
  type: 'codemod',
  name: 'update solo, dense and outlined in v-text-field to vue3 format',

  transform({ scriptASTs, sfcAST, utils: { traverseScriptAST, traverseTemplateAST, builders } }) {
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
          if (node.type === 'VElement' && node.name === 'v-text-field') {
            for (let i = 0; i < node.startTag.attributes.length; i++) {
              const attr = node.startTag.attributes[i];

              // Check if the attribute is "outlined"
              if (attr && attr.key && attr.key.name === 'outlined') {
                // Remove the "outlined" attribute
                node.startTag.attributes.splice(i, 1);

                //add variant="outlined"
                node.startTag.attributes.push(
                  builders.vAttribute(builders.vIdentifier('variant'), builders.vLiteral('outlined')),
                );
                i--; //Decrement since attribute was removed
              } else if (attr && attr.key && attr.key.name === 'dense') {
                // Remove the "dense" attribute
                node.startTag.attributes.splice(i, 1);

                //add density="compact"
                node.startTag.attributes.push(
                  builders.vAttribute(builders.vIdentifier('density'), builders.vLiteral('compact')),
                );
                i--; //Decrement since attribute was removed
              }
            }
            node.startTag.attributes = node.startTag.attributes.filter((prop: any) => !(prop.key.name === 'solo'));
            transformCount++; // Increment the count of transformations made
          }
        },
      });
    }

    return transformCount; // Return the number of transformations made
  },
};
