import type { CodemodPlugin } from 'vue-metamorph';

export const changeFilterAccessToMethod: CodemodPlugin = {
  type: 'codemod',
  name: 'change this.$options.filters.<method> to this.<method>',

  transform({ scriptASTs, utils: { traverseScriptAST } }) {
    let transformCount = 0;

    // Traverse the <script> ASTs to find and modify the filter access
    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitMemberExpression(path) {
          const { node } = path;
          // Check if it's `this.$options.filters.<method>`
          if (
            node.object
            && node.object.type === 'MemberExpression' // Check for MemberExpression
            && node.object.object
            && node.object.object.type === 'MemberExpression' // Check for another MemberExpression (this.$options)
            && node.object.object.object
            && node.object.object.object.type === 'ThisExpression' // Check if it's `this`
            && node.object.object.property
            && node.object.object.property.type === 'Identifier' // Check for `$options`
            && node.object.object.property.name === '$options'
            && node.object.property
            && node.object.property.type === 'Identifier' // Check for `filters`
            && node.object.property.name === 'filters'
            && node.property
            && node.property.type === 'Identifier' // Finally, check for the method name like `capitalizeAll`
          ) {
            const methodName = node.property.name; // Method name (like `capitalizeAll`)

            // Directly mutate the node:
            // Replace `this.$options.filters` with just `this`
            node.object = { type: 'ThisExpression' }; // Set object to `this`
            node.property = { type: 'Identifier', name: methodName }; // Set the method name (e.g., `capitalizeAll`)

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
