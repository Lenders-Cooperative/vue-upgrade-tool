import { CodemodPlugin } from 'vue-metamorph';

export const convertElementWithVForToTemplate: CodemodPlugin = {
  name: 'convert element with v-for to template',
  type: 'codemod',

  transform({ sfcAST, utils: { traverseTemplateAST } }) {
    let transformCount = 0;

    if (sfcAST) {
      // Traverse the template AST to find any element with the v-for directive
      traverseTemplateAST(sfcAST, {
        enterNode(node, parent) {
          // Check if it's an element with a start tag and attributes
          if (node.type === 'VElement' && node.startTag) {
            const { startTag } = node;

            // find v-for directive
            const vForDirective = startTag.attributes.find(
              (attr) => attr.type === 'VAttribute' && attr.key.type === 'VDirectiveKey' && attr.key.name.name === 'for', // Check for `v-for`
            );

            // Look for :key directive (bind:key)
            const vKeyDirective = startTag.attributes.find(
              (attr) =>
                attr.type === 'VAttribute' &&
                attr.key.type === 'VDirectiveKey' &&
                attr.key.name.name === 'bind' &&
                attr.key.argument?.type === 'VIdentifier' &&
                attr.key.argument?.name === 'key', // Check for `:key`
            );

            // If we find a v-for directive, transform this element
            if (vForDirective) {
              // Create a new <template> element
              const templateNode = {
                type: 'VElement',
                name: 'template',
                rawName: 'template', // Raw name of the tag
                namespace: null, // No namespace for HTML elements
                startTag: {
                  type: 'VStartTag',
                  attributes: [...(vForDirective ? [vForDirective] : []), ...(vKeyDirective ? [vKeyDirective] : [])],
                },
                endTag: { type: 'VEndTag', name: 'template' }, // End tag for <template>
                children: [node], // Move the original element inside the template
                parent, // Set the parent to the current node's parent
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any;

              // Remove v-for and :key from the original node
              if (vForDirective) {
                startTag.attributes = startTag.attributes.filter((attr) => attr !== vForDirective);
              }

              if (vKeyDirective) {
                startTag.attributes = startTag.attributes.filter((attr) => attr !== vKeyDirective);
              }

              // Replace the original element with the new <template> element
              if (parent && parent.type === 'VElement') {
                parent.children = parent.children.map((child) => (child === node ? templateNode : child));
              }

              // Increment transformation count
              transformCount++;
            }
          }
        },
      });
    }

    return transformCount; // Return the number of transformations made
  },
};

export default convertElementWithVForToTemplate;
