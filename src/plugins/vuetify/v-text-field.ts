import type { CodemodPlugin } from 'vue-metamorph';

export const updateVTextFieldPropsFormat: CodemodPlugin = {
  type: 'codemod',
  name: 'update solo, dense and outlined in v-text-field to vue3 format',

  transform({ scriptASTs, sfcAST, utils: { traverseScriptAST, traverseTemplateAST, builders } }) {
    let transformCount = 0;
    let hasVTextField: boolean;
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
            hasVTextField = true;
            node.name = 'TextField';
            node.rawName = 'TextField';
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
    scriptASTs.forEach((scriptAST) => {
      traverseScriptAST(scriptAST, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        visitImportDeclaration(node: any) {
          // Look for the import declaration
          if (
            node.value.type === 'ImportDeclaration' &&
            node.value.source.value === '@lenders-cooperative/los-app-ui-component-lib' &&
            hasVTextField
          ) {
            // Check if TextArea is already in the import
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasTextArea = node.value.specifiers.some((specifier: any) => specifier.local.name === 'TextField');

            // If TextArea is not already imported, add it
            if (!hasTextArea) {
              node.value.specifiers.push(builders.importSpecifier(builders.identifier('TextField')));
            }

            transformCount++; // Increment the count of transformations made
          }
          return false;
        },
        visitObjectExpression(node) {
          // Look for the components object to add TextField
          if (node.value.properties && hasVTextField) {
            for (const prop of node.value.properties) {
              if (prop.key.name === 'components') {
                const componentsObj = prop.value;

                // Check if TextField is already in components
                const hasTextField = componentsObj.properties.some(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (component: any) => component.key.name === 'TextField',
                );

                // If TextField is not already in the components object, add it
                if (!hasTextField) {
                  componentsObj.properties.push(
                    builders.property('init', builders.identifier('TextField'), builders.identifier('TextField')),
                  );
                }
                transformCount++; // Increment the count of transformations made

                break;
              }
            }
          }
          return false;
        },
      });
    });

    return transformCount; // Return the number of transformations made
  },
};
