import type { CodemodPlugin } from 'vue-metamorph';

export const changeThisUidToDollarUid: CodemodPlugin = {
  type: 'codemod',
  name: 'change this._uid to this.$.uid',

  transform({ scriptASTs, utils: { traverseScriptAST } }) {
    let transformCount = 0;

    // Traverse the <script> ASTs and look for instances of 'this._uid'
    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitMemberExpression(path) {
          // Check if we are looking at 'this._uid'
          if (
            path.node.object.type === 'ThisExpression'
            && path.node.property.type === 'Identifier'
            && path.node.property.name === '_uid'
          ) {
            path.node.object = {
              type: 'MemberExpression',
              object: {
                type: 'ThisExpression',
              },
              property: {
                type: 'Identifier',
                name: '$',
              },
            };

            path.node.property = {
              type: 'Identifier',
              name: 'uid',
            };
            transformCount++;
          }
          return this.traverse(path);
        },
      });
    }

    return transformCount;
  },
};
