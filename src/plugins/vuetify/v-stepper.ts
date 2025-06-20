import type { CodemodPlugin } from 'vue-metamorph';
export const changeVStepperProperties: CodemodPlugin = {
  type: 'codemod',
  name: 'change v-stepper properties',

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
          if (node.type === 'VElement' && node.name === 'v-stepper-step') {
            node.rawName = 'v-stepper-item';
            node.name = 'v-stepper-item';
            const attrs = node.startTag.attributes;

            for (let i = 0; i < attrs.length; i++) {
              const attr = attrs[i];

              if (attr && attr.type === 'VAttribute' && attr.key.name === 'step' && attr.value) {
                let rawValue: string = '';
                if (attr.value.type === 'VLiteral') {
                  rawValue = attr.value.value;
                } else if (
                  attr.value.type === 'VExpressionContainer' &&
                  attr.value.expression &&
                  attr.value.expression.type === 'Identifier'
                ) {
                  rawValue = attr.value.expression.name;
                }
                const num = Number(rawValue);
                let expression;
                // check to try to get correct value without quoting
                if (!Number.isNaN(num)) {
                  expression = { type: 'Literal', value: num };
                } else if (/^[a-zA-Z_$][\w$]*$/.test(rawValue)) {
                  // simple variable name
                  expression = { type: 'Identifier', name: rawValue };
                } else {
                  // fallback, may quote
                  expression = { type: 'Literal', value: rawValue };
                }
                const directiveNode = {
                  parent: attr.parent,
                  type: attr.type,
                  key: {
                    type: 'VDirectiveKey',
                    name: {
                      type: 'VIdentifier',
                      name: 'bind',
                    },
                    argument: {
                      type: 'VExpressionContainer',
                      expression: {
                        type: 'Identifier',
                        name: 'step',
                      },
                    },
                    modifiers: [],
                    rawName: ':value',
                  },
                  value: {
                    type: 'VExpressionContainer',
                    expression,
                  },
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                attrs[i] = { ...attrs[i], ...directiveNode } as any;
                transformCount++;
              }
            }
          } else if (node.type === 'VElement' && node.name === 'v-stepper-items') {
            node.rawName = 'v-stepper-window';
            node.name = 'v-stepper-window';
            transformCount++;
          } else if (node.type === 'VElement' && node.name === 'v-stepper-content') {
            node.rawName = 'v-stepper-window-item';
            node.name = 'v-stepper-window-item';
            transformCount++;
          }
        },
      });
    }
    return transformCount;
  },
};
