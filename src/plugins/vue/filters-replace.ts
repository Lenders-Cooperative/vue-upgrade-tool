/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodemodPlugin } from 'vue-metamorph';

export const convertFiltersToFunctionCalls: CodemodPlugin = {
  name: 'convert filters to function calls',
  type: 'codemod',

  transform({ sfcAST, utils: { traverseTemplateAST } }) {
    let transformCount = 0;

    const getNestedValue = (val: any) => {
      if (!val.object.object) {
        return `${val.object.name}.${val.property.name}`;
      }
      return `${val.object.object.name}.${val.object.property.name}.${val.property.name}`;
    };
    const getExpressionValue = (expression: any) => {
      let expressionValue = expression.name ?? '';
      if (expression.type === 'ConditionalExpression') {
        const testValue = getExpressionValue(expression.test);
        const consequentValue = getExpressionValue(expression.consequent);
        const altValue = getExpressionValue(expression.alternate);
        expressionValue = `${testValue} ? ${consequentValue} : ${altValue}`;
      } else if (expression.type === 'CallExpression') {
        const args = expression.arguments.map((arg: any) => {
          const value = getExpressionValue(arg);
          return value;
        });
        expressionValue = `${expression.callee.name}(${args.join(', ')})`;
      } else if (expression.raw) {
        expressionValue = expression.raw;
      } else if (!expression.name && !expression.raw && expression.object) {
        expressionValue = getNestedValue(expression);
      }
      return expressionValue;
    };

    // Function to convert filter chain to function call
    const convertToFunctionCall = (filters: any[], expression: any) => {
      // Base case: if no filters, return the expression itself
      const expressionValue = getExpressionValue(expression);
      if (filters.length === 0) return expressionValue;

      // Start with the last filter in the sequence
      const firstFilter = filters.shift();
      const firstFilterArgs = [expressionValue];
      if (firstFilter.arguments?.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        firstFilter.arguments.forEach((arg: any) => {
          firstFilterArgs.push(arg.value);
        });
      }
      let result = `${firstFilter.callee.name}(${firstFilterArgs.join(', ')})`;

      // Loop through the filters and nest them
      for (let index = filters.length; index > 0; index--) {
        const firstFilterInLoop = filters.shift();
        const nextFilter = firstFilterInLoop.callee.name;
        result = `${nextFilter}(${result})`; // Nest the function call
      }

      // Now wrap the final result with the base expression (test) at the deepest level
      return result; // Final filter applied to the value (e.g. test)
    };

    if (sfcAST) {
      // Traverse the template AST to find filter chains in expressions (like {{ ... | filter1 | filter2 }})
      traverseTemplateAST(sfcAST, {
        enterNode(node) {
          // Handle VFilterSequenceExpression (used for sequences of filters)
          if (node.type === 'VFilterSequenceExpression') {
            const { expression } = node; // The initial expression (e.g. 'test')
            const { filters } = node; // The array of filters

            // Convert the filter chain to function calls
            const functionCall = convertToFunctionCall(filters, expression);

            // Update the expression with the new function call
            node.expression = {
              type: 'JSXText',
              value: functionCall,
            };

            transformCount++;
          }
        },
      });
    }

    return transformCount; // Return the number of transformations made
  },
};

export default convertFiltersToFunctionCalls;
