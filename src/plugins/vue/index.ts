import { Plugin } from 'vue-metamorph';
import { vueSetManualPlugin, vueSetPlugin } from './set';
import { vueDeletePlugin } from './delete';
import { vueUsePlugin } from './use';
import { contextualHPlugin } from './h';
import { defineComponentPlugin } from './defineComponent';

export const vue = (): Plugin[] => ([
  vueSetPlugin,
  vueSetManualPlugin,
  vueDeletePlugin,
  vueUsePlugin,
  contextualHPlugin,
  defineComponentPlugin,
]);
