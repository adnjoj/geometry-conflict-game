import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

import { ItemsPanel } from '../ItemsPanel';
import { Tab } from '../Tab/Tab';

import { TabContentWeapon1 } from './TabContents/TabContentWeapon1';
import { TabContentWeapon2 } from './TabContents/TabContentWeapon2';
import { TabContentExtraWeapon } from './TabContents/TabContentExtraWeapon';
import { TabContentAmmo } from './TabContents/TabContentAmmo';

export class EquipmentPanel extends ItemsPanel {
  constructor(scene: Phaser.Scene) {
    super(scene);

    const tabs = {
      Weapon1: new TabContentWeapon1(scene),
      Weapon2: new TabContentWeapon2(scene),
      ExtraWeapon: new TabContentExtraWeapon(scene),
      // Traps: null,
      // Gadgets: null,
      // Medicine: null,
      Ammo: new TabContentAmmo(scene),
    };

    for (const [id, content] of Object.entries(tabs)) {
      const label = get(_)(`equipmentTabs.${id}`);
      const tab = new Tab(label, scene);
      this.tabs.set(id, { tab, content });
    }

    super.initializeTabs();
  }
}
