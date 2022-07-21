import { autorun } from 'mobx';
import { EquipmentFilter } from '../../../../../../../core/item-filters/EquipmentFilter';
import { Image } from '../../../../Common/Image/Image';
import { TabContent } from '../../Tab/TabContent';

import { cabinetStore } from '../../../../../../../core/mobx/CabinetStore';
import { weaponsStore } from '../../../../../../../core/mobx/WeaponsStore';

export class TabContentWeapon1 extends TabContent {
  constructor(scene: Phaser.Scene) {
    super(scene);

    const equipmentFilter = new EquipmentFilter();

    autorun(() => {
      this.itemImages.forEach((image) => image.destroy());

      this.itemImages = equipmentFilter
        .forTabWeapon1(weaponsStore.weapons)
        .map((weapon) =>
          new Image(scene, `weapon-${weapon.id}`)
            .setSize(160, 160)
            .on('pointerdown', () => {
              cabinetStore.setWeapon(weapon, 0);
            }),
        );

      this.update();
    });
  }
}
