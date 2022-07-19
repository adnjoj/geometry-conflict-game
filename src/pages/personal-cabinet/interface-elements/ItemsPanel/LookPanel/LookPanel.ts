import { autorun } from 'mobx';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

import { ItemsPanel } from '../ItemsPanel';
import { Tab } from '../Tab/Tab';
import { TabContentLook } from './TabContents/TabContentLook';

import { skinTypesStore } from '../../../../../core/mobx/SkinTypesStore';

export class LookPanel extends ItemsPanel {
  constructor(scene: Phaser.Scene) {
    super(scene);

    autorun(() => {
      this.tabs.forEach(({ tab, content }) => {
        tab.destroy();
        content.destroy();
      });

      this.tabs = new Map();

      skinTypesStore.skinTypes.forEach(({ id, name }) => {
        const label = get(_)(`skinTypes.${name}`);
        const tab = new Tab(label, scene);
        const content = new TabContentLook(scene, id);
        this.tabs.set(name, { tab, content });
      });

      super.initializeTabs();
    });
  }
}
