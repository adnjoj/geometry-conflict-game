import type { Skin } from '../../types/Skin';

import { cabinetStore } from '../mobx/CabinetStore';

export class SkinsFilter {
  filterByTypes(
    items: Array<Skin>,
    { include, exclude }: { include?: number[]; exclude?: number[] },
  ) {
    return items
      .filter(({ type }) => !include || include.includes(type.id))
      .filter(({ type }) => !exclude || !exclude.includes(type.id));
  }

  selectAvailableForCurrentFraction(items: Array<Skin>) {
    return items.filter((item) =>
      item.availableFractions.find(
        ({ id }) => id === cabinetStore.selectedFraction,
      ),
    );
  }
}
