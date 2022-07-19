import { autorun } from 'mobx';
import type { Tab } from './Tab/Tab';
import type { TabContent } from './Tab/TabContent';

import { InterfaceElement } from '../../../../types/InterfaceElement';
import { cabinetStore } from '../../../../core/mobx/CabinetStore';

export class ItemsPanel extends InterfaceElement {
  protected backgroundImage: Phaser.GameObjects.Image;
  protected tabs = new Map<string, { tab: Tab; content: TabContent }>();

  constructor(protected readonly scene: Phaser.Scene) {
    super();
    this.backgroundImage = this.scene.add.image(0, 0, 'items-panel');
  }

  initializeTabs() {
    this.tabs.forEach(({ tab }, id) => {
      tab.on('pointerdown', () => cabinetStore.setSelectedTab(id));
    });

    this.update();

    autorun(() => {
      this.tabs.forEach(({ tab, content }) => {
        tab.setSelected(false);
        content.setVisible(false);
      });

      this.tabs.get(cabinetStore.selectedTab)?.tab?.setSelected(true);
      this.tabs.get(cabinetStore.selectedTab)?.content?.setVisible(true);
    });
  }

  protected updateScale() {
    this.backgroundImage.setScale(this.scale);

    this.tabs.forEach(({ tab, content }) => {
      tab.setScale(this.scale);
      content.setScale(this.scale);
    });
  }

  protected updatePosition() {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.backgroundImage.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );

    Array.from(this.tabs.values()).forEach(({ tab, content }, index) => {
      tab.setPosition(
        this.position.x - 773 + 259 * index,
        this.position.y - 156,
      );
      content.setPosition(this.position.x, this.position.y);
    });
  }

  protected updateVisibility() {
    this.backgroundImage.setVisible(this.visible);

    this.tabs.forEach(({ tab, content }, id) => {
      tab.setVisible(this.visible);

      if (id === cabinetStore.selectedTab) {
        content.setVisible(this.visible);
      } else {
        content.setVisible(false);
      }
    });
  }
}
