import {
  CodemodPlugin, ManualMigrationPlugin, namedTypes, Kinds,
} from 'vue-metamorph';

const isVueSet = (node: namedTypes.CallExpression) => {
  if (node.callee.type !== 'MemberExpression') {
    return false;
  }

  // whatever.$set()
  if (node.callee.property.type === 'Identifier'
    && node.callee.property.name === '$set') {
    return true;
  }

  // Vue.set()
  if (node.callee.object.type === 'Identifier'
    && node.callee.property.type === 'Identifier'
    && node.callee.object.name === 'Vue'
    && node.callee.property.name === 'set') {
    return true;
  }

  return false;
};

const isValid = (node: Kinds.ExpressionKind | namedTypes.SpreadElement | undefined): node is Kinds.ExpressionKind => !!node && node.type !== 'SpreadElement';

export const vueSetManualPlugin: ManualMigrationPlugin = {
  type: 'manual',
  name: 'vue-set-manual',
  find({ scriptASTs, report, utils: { traverseScriptAST } }) {
    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitCallExpression(path) {
          if (isVueSet(path.node) && path.node.arguments.length !== 3) {
            report(path.node, 'Cannot automatically migrate this code - the call expression must have 3 arguments');
          }
          this.traverse(path);
        },
      });
    }
  },
};

export const vueSetPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vue-set',
  transform({
    scriptASTs,
    sfcAST,
    utils: {
      traverseTemplateAST,
      traverseScriptAST,
      builders,
    },
  }) {
    let count = 0;

    // look for something.$set() or Vue.set() calls in the script
    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitCallExpression(path) {
          if (isVueSet(path.node)) {
            const [target, property, value] = path.node.arguments;
            if (!isValid(target) || !isValid(property) || !isValid(value)) {
              return this.traverse(path);
            }

            let computed = true;
            let key;
            if (property.type === 'Literal'
              && typeof property.value === 'string'
              && !/(^\d)|[\s-]/.test(property.value)) {
              computed = false;
              key = builders.identifier(property.value);
            } else {
              key = property;
            }

            path.replace(
              builders.assignmentExpression(
                '=',
                builders.memberExpression(
                  target,
                  key,
                  computed,
                ),
                value,
              ),
            );

            count++;
            return false;
          }

          return this.traverse(path);
        },
      });
    }

    // look for $set() calls in the template
    if (sfcAST) {
      traverseTemplateAST(sfcAST, {
        enterNode(node) {
          if (node.type === 'ExpressionStatement') {
            if (node.expression?.type === 'CallExpression'
              && node.expression.callee.type === 'Identifier'
              && node.expression.callee.name === '$set') {
              const [target, property, value] = node.expression.arguments;
              if (!isValid(target) || !isValid(property) || !isValid(value)) {
                return;
              }

              const newKey = property.type === 'Literal' && typeof property.value === 'string'
                ? builders.identifier(property.value)
                : property;
              node.expression = builders.assignmentExpression(
                '=',
                builders.memberExpression(
                  target,
                  newKey,
                  property.type !== 'Literal',
                ),
                value,
              );

              count++;
            }
          }
        },
      });
    }

    return count;
  },
};
