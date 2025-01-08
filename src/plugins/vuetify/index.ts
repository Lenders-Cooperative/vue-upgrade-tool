import { Plugin } from 'vue-metamorph';
import { changeVTabItemToVWindowItem } from './vuetify';

export const vuetify = (): Plugin[] => [changeVTabItemToVWindowItem];
