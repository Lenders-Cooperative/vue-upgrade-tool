import { Plugin } from 'vue-metamorph';
import { changeVTabItemToVWindowItem } from './v-tab-item';
import { changeVListItemGroupToVListGroup } from './v-list-item';

export const vuetify = (): Plugin[] => [changeVTabItemToVWindowItem, changeVListItemGroupToVListGroup];
