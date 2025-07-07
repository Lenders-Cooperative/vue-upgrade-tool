import type { CodemodPlugin } from 'vue-metamorph';

export const updateVCheckboxToCheckbox: CodemodPlugin = {
  type: 'codemod',
  name: 'update v-checkbox to our component Checkbox',

  transform({ scriptASTs, sfcAST, utils: { traverseScriptAST, traverseTemplateAST, builders } }) {
    let transformCount = 0;
    let hasVCheckBox: boolean;
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
          if (node.type === 'VElement' && node.name === 'v-checkbox') {
            hasVCheckBox = true;
            node.name = 'CheckBox';
            node.rawName = 'CheckBox';
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
            node.value.source.value === '@sba-ulp/ulp-npm-ui-component-lib' &&
            hasVCheckBox
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasCheckbox = node.value.specifiers.some((specifier: any) => specifier.local.name === 'CheckBox');

            if (!hasCheckbox) {
              node.value.specifiers.push(builders.importSpecifier(builders.identifier('CheckBox')));
            }

            transformCount++; // Increment the count of transformations made
          }
          return false;
        },
        visitObjectExpression(node) {
          // Look for the components object to add CheckBox
          if (node.value.properties && hasVCheckBox) {
            for (const prop of node.value.properties) {
              if (prop.key.name === 'components') {
                const componentsObj = prop.value;

                // Check if CheckBox is already in components
                const hasTextField = componentsObj.properties.some(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (component: any) => component.key.name === 'CheckBox',
                );

                // If CheckBox is not already in the components object, add it
                if (!hasTextField) {
                  componentsObj.properties.push(
                    builders.property('init', builders.identifier('CheckBox'), builders.identifier('CheckBox')),
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
