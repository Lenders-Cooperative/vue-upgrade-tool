import type { CodemodPlugin } from 'vue-metamorph';

export const changeMDIIconText: CodemodPlugin = {
  type: 'codemod',
  name: 'change mdi-* to mdi:mdi-*',

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
        enterNode(node, parent) {
          // Only transform mdi-* if inside a v-icon element
          const isInVIcon = parent && parent.type === 'VElement' && parent.name === 'v-icon';

          if (isInVIcon) {
            // Look for VText nodes with value matching mdi-*
            if (node.type === 'VText' && typeof node.value === 'string') {
              const mdiMatch = /^mdi-.+/.test(node.value);
              if (mdiMatch) {
                node.value = `mdi:${node.value}`;
                transformCount++;
              }
            }
            // Also check for VAttribute with static value
            if (node.type === 'VStartTag' && node.attributes) {
              node.attributes.forEach((attr) => {
                let isMdiIcon = false;
                if (attr.type === 'VAttribute' && attr.value && attr.value.type === 'VLiteral') {
                  isMdiIcon = /^mdi-.+/.test(attr?.value?.value ?? '');
                  if (attr.key.name === 'icon' && isMdiIcon) {
                    attr.value.value = `"mdi:${attr.value.value}"`;
                    transformCount++;
                  }
                }
              });
              //   const val = node.value.value;
              //   if (/^mdi-.+/.test(val)) {
              //     node.value.value = `mdi:${val}`;
              //   }
            }
          }
        },
      });
    }

    return transformCount;
  },
};
