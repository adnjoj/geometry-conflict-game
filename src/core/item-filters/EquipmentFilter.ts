import type { Clip } from '../../types/Clip';
import type { Weapon } from '../../types/Weapon';

import { cabinetStore } from '../mobx/CabinetStore';
import { weaponTypesStore } from '../mobx/WeaponTypesStore';

export class EquipmentFilter {
  forTabWeapon1(weapons: Weapon[]) {
    if (weaponTypesStore.weaponTypes.length === 0) return [];

    return this.filterByTypes(
      this.selectAvailableForCurrentSpeciality(weapons) as Weapon[],
      {
        exclude: [
          weaponTypesStore.elementsEnum.Knife?.id,
          weaponTypesStore.elementsEnum.Pistol?.id,
          weaponTypesStore.elementsEnum.SubmachineGun?.id,
        ],
      },
    );
  }

  forTabWeapon2(weapons: Weapon[]) {
    if (weaponTypesStore.weaponTypes.length === 0) return [];

    return this.filterByTypes(
      this.selectAvailableForCurrentSpeciality(weapons) as Weapon[],
      {
        include: [
          weaponTypesStore.elementsEnum.SubmachineGun?.id,
          weaponTypesStore.elementsEnum.Pistol?.id,
        ],
      },
    );
  }

  forTabWeapon3(weapons: Weapon[]) {
    if (weaponTypesStore.weaponTypes.length === 0) return [];

    return this.filterByTypes(
      this.selectAvailableForCurrentSpeciality(weapons) as Weapon[],
      {
        include: [weaponTypesStore.elementsEnum.Knife?.id],
      },
    );
  }

  forTabAmmo(clips: Clip[]) {
    return this.selectAvailableForCurrentSpeciality(clips) as Clip[];
  }

  private filterByTypes(
    items: Array<Weapon>,
    { include, exclude }: { include?: number[]; exclude?: number[] },
  ) {
    return items
      .filter(({ type }) => !include || include.includes(type.id))
      .filter(({ type }) => !exclude || !exclude.includes(type.id));
  }

  private selectAvailableForCurrentSpeciality(items: Array<Weapon | Clip>) {
    return items.filter((item) =>
      item.availableSpecialities.find(
        ({ id }) => id === cabinetStore.selectedSpeciality,
      ),
    );
  }
}
