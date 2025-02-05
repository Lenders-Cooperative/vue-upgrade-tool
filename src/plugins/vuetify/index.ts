import { Plugin } from 'vue-metamorph';
import { changeVTabItemToVWindowItem } from './v-tab-item';
import { changeVListItemGroupToVListGroup } from './v-list-item';
import { updateVTextFieldPropsFormat } from './v-text-field';
import { changeVBtnTextToVariant } from './v-btn-text';
import { updateVMenuSlot } from './v-menu';
import { updateVCheckboxToCheckbox } from './v-checkbox';

export const vuetify = (): Plugin[] => [
  changeVTabItemToVWindowItem,
  changeVListItemGroupToVListGroup,
  updateVTextFieldPropsFormat,
  changeVBtnTextToVariant,
  updateVMenuSlot,
  updateVCheckboxToCheckbox,
];
