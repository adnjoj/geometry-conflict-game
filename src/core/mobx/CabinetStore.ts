import { action, makeAutoObservable } from 'mobx';
import type { Clip } from '../../types/Clip';
import type { Weapon } from '../../types/Weapon';
import type { User } from '../../types/User';
import type { Skin } from '../../types/Skin';

import { Activity } from '../../pages/personal-cabinet/interface-elements/ActivitiesMenu/ActivitiesMenu';

import { UserApiClient } from '../api-client/user/UserApiClient';

export class CabinetStore {
  finishedParsing = false;
  parsingError = null;

  currentActivity = Activity.EQUIPMENT;
  selectedTab = 'Weapon1';
  selectedFraction = 1;
  selectedSpeciality = 1;
  selectedMap: number = undefined;

  equipment = new Map<number, { id: number; amount: number }[]>();
  lookElements = new Map<number, { id: number }>();

  constructor() {
    makeAutoObservable(this);
  }

  parseData() {
    this.finishedParsing = false;

    UserApiClient.getLogged()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (user: User) => {
          this.finishedParsing = true;
          this.parsingError = null;

          this.selectedFraction = user.fraction?.id;
          this.selectedSpeciality = user.speciality?.id;

          if (!this.selectedFraction) this.setSelectedFraction(1);
          if (!this.selectedSpeciality) this.setSelectedSpeciality(1);

          this.selectedMap = user.map?.id ?? undefined;

          this.equipment = new Map();
          this.lookElements = new Map();

          for (const { skin } of user.skins) {
            this.lookElements.set(skin.type.id, { id: skin.id });
          }

          for (const { slot, weapon } of user.weapons) {
            this.equipment.set(slot, [{ id: weapon.id, amount: 1 }]);
          }

          this.equipment.set(4, []);
          for (const { amount, clip } of user.clips) {
            this.equipment.get(4).push({ id: clip.id, amount });
          }
        }),
      )
      .catch(
        action('fetchError', (error: Error) => {
          this.finishedParsing = true;
          this.parsingError = error;
        }),
      );
  }

  setSelectedTab(selectedTabId: string) {
    this.selectedTab = selectedTabId;
  }

  setCurrentActivity(currentActivity: number) {
    this.currentActivity = currentActivity;
  }

  setSelectedFraction(selectedFraction: number) {
    UserApiClient.setFraction({ fraction: { id: selectedFraction } });
    this.lookElements = new Map();
    this.selectedFraction = selectedFraction;
  }

  setSelectedSpeciality(selectedSpeciality: number) {
    UserApiClient.setSpeciality({ speciality: { id: selectedSpeciality } });
    this.equipment = new Map();
    this.selectedSpeciality = selectedSpeciality;
  }

  setSelectedMap(selectedMapId: number) {
    UserApiClient.setMap({ map: { id: selectedMapId } });
    this.selectedMap = selectedMapId;
  }

  setLookElement(type: number, element: Skin) {
    UserApiClient.setSkin({ skin: { id: element.id } });
    this.lookElements.set(type, { id: element.id });
  }

  setWeapon({ id }: Weapon, slot: number) {
    UserApiClient.setWeapon({ slot, weapon: { id } });
    this.equipment.set(slot, [{ id, amount: 1 }]);
  }

  removeWeapon(slot: number) {
    UserApiClient.removeWeapon({ slot });
    this.equipment.delete(slot);
  }

  addClip({ id }: Clip) {
    UserApiClient.addClip({ clip: { id } });

    const slot = 4;

    if (!this.equipment.has(slot)) this.equipment.set(slot, []);

    const currentValue = this.equipment.get(slot);
    const foundClip = currentValue.find((clip) => clip.id === id);

    if (foundClip) foundClip.amount += 1;
    else currentValue.push({ id, amount: 1 });
  }

  removeClip({ id }: Clip) {
    UserApiClient.removeClip({ clip: { id } });

    const slot = 4;
    const currentValue = this.equipment.get(slot);
    const foundClip = currentValue.find((clip) => clip.id === id);

    if (foundClip.amount > 1) foundClip.amount -= 1;
    else currentValue.splice(currentValue.indexOf(foundClip), 1);
  }
}

export const cabinetStore = new CabinetStore();
