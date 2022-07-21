import { autorun } from 'mobx';
import { SkinsFilter } from '../../../../../../../core/item-filters/SkinsFilter';
import { Image } from '../../../../Common/Image/Image';
import { TabContent } from '../../Tab/TabContent';

import { cabinetStore } from '../../../../../../../core/mobx/CabinetStore';
import { skinsStore } from '../../../../../../../core/mobx/SkinsStore';

export class TabContentLook extends TabContent {
  constructor(scene: Phaser.Scene, lookType: number) {
    super(scene);

    const skinsFilter = new SkinsFilter();

    autorun(() => {
      if (this.destroyed) return;

      this.itemImages.forEach((image) => image.destroy());

      this.itemImages = skinsFilter
        .filterByTypes(
          skinsFilter.selectAvailableForCurrentFraction(skinsStore.skins),
          { include: [lookType] },
        )
        .map((skin) =>
          new Image(scene, `skin-${skin.id}`)
            .setSize(160, 160)
            .on('pointerdown', () => {
              cabinetStore.setLookElement(lookType, skin);
            }),
        );

      this.update();
    });
  }
}
