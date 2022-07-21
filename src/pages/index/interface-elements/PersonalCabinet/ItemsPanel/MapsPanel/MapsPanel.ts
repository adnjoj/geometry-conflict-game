import { autorun } from 'mobx';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

import { Tab } from '../Tab/Tab';
import { TabContentMaps } from './TabContents/TabContentMaps';
import { ItemsPanel } from '../ItemsPanel';

import { gamemodesStore } from '../../../../../../core/mobx/GamemodesStore';

export class MapsPanel extends ItemsPanel {
  constructor(scene: Phaser.Scene) {
    super(scene);

    autorun(() => {
      this.tabs.forEach(({ tab, content }) => {
        tab.destroy();
        content.destroy();
      });

      this.tabs = new Map();

      gamemodesStore.gamemodes.forEach(({ name }) => {
        const label = get(_)(`gamemodes.${name}`);
        const tab = new Tab(label, scene);
        const content = new TabContentMaps(scene, name);
        this.tabs.set(name, { tab, content });
      });

      super.initializeTabs();
    });
  }
}
