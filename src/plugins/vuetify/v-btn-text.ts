import type { CodemodPlugin } from 'vue-metamorph';

export const changeVBtnTextToVariant: CodemodPlugin = {
  type: 'codemod',
  name: 'change v-btn text to variant="text"',

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
          if (node.type === 'VElement' && node.name === 'v-btn') {
            const { startTag } = node;
            if (startTag) {
              const textAttribute = startTag.attributes.find((attr) => attr.key.name === 'text');

              if (textAttribute) {
                startTag.attributes = startTag.attributes.filter((attr) => attr.key.name !== 'text');
                const tagAttr = {
                  type: 'VAttribute',
                  key: {
                    type: 'VIdentifier',
                    name: 'variant',
                    rawName: 'variant',
                    parent: textAttribute.key.parent,
                  },
                  value: {
                    type: 'VLiteral',
                    value: 'text',
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
                startTag.attributes.push(tagAttr);

                transformCount++;
              }
            }
          }
        },
      });
    }

    return transformCount;
  },
};
