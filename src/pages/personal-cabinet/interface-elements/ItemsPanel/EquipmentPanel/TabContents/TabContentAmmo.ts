import { autorun } from 'mobx';
import { EquipmentFilter } from '../../../../../../core/item-filters/EquipmentFilter';
import { Image } from '../../../Image/Image';
import { TabContent } from '../../Tab/TabContent';

import { cabinetStore } from '../../../../../../core/mobx/CabinetStore';
import { clipsStore } from '../../../../../../core/mobx/ClipsStore';

export class TabContentAmmo extends TabContent {
  constructor(scene: Phaser.Scene) {
    super(scene);

    const equipmentFilter = new EquipmentFilter();

    autorun(() => {
      this.itemImages.forEach((image) => image.destroy());

      this.itemImages = equipmentFilter
        .forTabAmmo(clipsStore.clips)
        .map((clip) =>
          new Image(scene, `clip-${clip.id}`)
            .setSize(160, 160)
            .on('pointerdown', () => {
              cabinetStore.addClip(clip);
            }),
        );

      this.update();
    });
  }
}
