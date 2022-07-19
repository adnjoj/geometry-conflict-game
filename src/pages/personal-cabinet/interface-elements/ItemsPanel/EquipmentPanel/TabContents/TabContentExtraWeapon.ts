import { autorun } from 'mobx';
import { EquipmentFilter } from '../../../../../../core/item-filters/EquipmentFilter';
import { Image } from '../../../Image/Image';
import { TabContent } from '../../Tab/TabContent';

import { cabinetStore } from '../../../../../../core/mobx/CabinetStore';
import { weaponsStore } from '../../../../../../core/mobx/WeaponsStore';

export class TabContentExtraWeapon extends TabContent {
  constructor(scene: Phaser.Scene) {
    super(scene);

    const equipmentFilter = new EquipmentFilter();

    autorun(() => {
      this.itemImages.forEach((image) => image.destroy());

      this.itemImages = equipmentFilter
        .forTabWeapon3(weaponsStore.weapons)
        .map((weapon) =>
          new Image(scene, `weapon-${weapon.id}`)
            .setSize(160, 160)
            .on('pointerdown', () => {
              cabinetStore.setWeapon(weapon, 2);
            }),
        );

      this.update();
    });
  }
}
