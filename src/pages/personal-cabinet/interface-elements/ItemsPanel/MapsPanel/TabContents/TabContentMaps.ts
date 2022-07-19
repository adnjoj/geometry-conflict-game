import { autorun } from 'mobx';
import type { Map } from '../../../../../../types/Map';

import { Image } from '../../../Image/Image';
import { TabContent } from '../../Tab/TabContent';

import { mapsStore } from '../../../../../../core/mobx/MapsStore';
import { cabinetStore } from '../../../../../../core/mobx/CabinetStore';

export class TabContentMaps extends TabContent {
  private checkMark: Image;
  private maps: Map[] = [];

  constructor(scene: Phaser.Scene, gamemode: string) {
    super(scene);

    this.checkMark = new Image(scene, 'check-mark').setSize(50, 50).setDepth(1);

    autorun(() => {
      if (this.destroyed) return;

      this.itemImages.forEach((image) => image.destroy());

      if (!cabinetStore.selectedMap) {
        this.checkMark.setPosition(10000000000, 0);
      }

      this.maps = mapsStore.maps.filter(
        (map) => map.gamemode.name === gamemode,
      );

      this.itemImages = this.maps.map((map) =>
        new Image(scene, `map-${map.id}`)
          .setSize(160, 160)
          .on('pointerdown', () => {
            cabinetStore.setSelectedMap(map.id);
          }),
      );

      this.update();
    });
  }

  protected updateScale(): void {
    super.updateScale();
    this.checkMark.setScale(this.scale);
  }

  protected updatePosition(): void {
    super.updatePosition();

    const index = this.maps.findIndex(
      ({ id }) => id === cabinetStore.selectedMap,
    );

    if (index === -1) {
      this.checkMark.setPosition(10000000000, 0);
      return;
    }

    this.checkMark.setPosition(
      this.itemImages[index].position.x + 60,
      this.itemImages[index].position.y + 60,
    );
  }

  protected updateVisibility(): void {
    super.updateVisibility();
    this.checkMark.setVisible(this.visible);
  }

  destroy() {
    super.destroy();
    this.checkMark.destroy();
  }
}
