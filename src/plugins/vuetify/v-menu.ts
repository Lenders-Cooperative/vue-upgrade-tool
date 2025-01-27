import { CodemodPlugin, AST, builders } from 'vue-metamorph';

export const updateVMenuSlot: CodemodPlugin = {
  type: 'codemod',
  name: 'update v-menu slot name and props',

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

    // Helper function to check if a template is under a <v-menu>
    function isUnderVMenu(node: AST.VElement): boolean {
      let current: AST.VElement | AST.VDocumentFragment | null = node.parent;

      while (current) {
        // Check if the current node is a VElement and has the name 'v-menu'
        if (current.type === 'VElement' && current.name === 'v-menu') {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    if (sfcAST) {
      traverseTemplateAST(sfcAST, {
        enterNode(node) {
          if (node.type === 'VElement') {
            if (isUnderVMenu(node)) {
              if (node.name === 'template') {
                const slotDirective = node.startTag.attributes.find(
                  (attr) =>
                    attr.type === 'VAttribute' &&
                    attr.directive === true &&
                    attr.key.type === 'VDirectiveKey' &&
                    attr.key.name.name === 'slot' &&
                    attr.key.argument?.type === 'VIdentifier' &&
                    attr.key.argument.name === 'activator',
                );

                if (slotDirective && slotDirective.key.type === 'VDirectiveKey') {
                  if (slotDirective.value?.type === 'VExpressionContainer') {
                    if (slotDirective.value?.expression?.type === 'VSlotScopeExpression') {
                      slotDirective.value.expression.params = [builders.identifier('{ props }')];
                    }
                  }
                }
              }

              const bindAttrs = node.startTag.attributes.find(
                (attr) =>
                  attr.type === 'VAttribute' &&
                  attr.directive === true &&
                  attr.key.type === 'VDirectiveKey' &&
                  attr.key.name.name === 'bind' &&
                  attr.value?.type === 'VExpressionContainer' &&
                  attr.value.expression?.type === 'Identifier' &&
                  attr.value.expression.name === 'attrs',
              );

              const onEvents = node.startTag.attributes.find(
                (attr) =>
                  attr.type === 'VAttribute' &&
                  attr.directive === true &&
                  attr.key.type === 'VDirectiveKey' &&
                  attr.key.name.name === 'on' &&
                  attr.value?.type === 'VExpressionContainer' &&
                  attr.value.expression?.type === 'Identifier' &&
                  attr.value.expression.name === 'on',
              );

              if (bindAttrs || onEvents) {
                // Remove the old attributes
                if (bindAttrs) {
                  node.startTag.attributes = node.startTag.attributes.filter((attr) => attr !== bindAttrs);
                }
                if (onEvents) {
                  node.startTag.attributes = node.startTag.attributes.filter((attr) => attr !== onEvents);
                }

                // Add v-bind="props"
                node.startTag.attributes.push(
                  builders.vDirective(
                    builders.vDirectiveKey(builders.vIdentifier('bind')),
                    builders.vExpressionContainer(builders.identifier('props')),
                  ),
                );
              }
            }
            transformCount++;
          }
        },
      });
    }

    return transformCount;
  },
};
