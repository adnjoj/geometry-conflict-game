import { action, makeAutoObservable } from 'mobx';
import { WeaponTypesApiClient } from '../api-client/weapons/WeaponTypesApiClient';
import type { WeaponType } from '../../types/WeaponType';

export class WeaponTypesStore {
  weaponTypes: WeaponType[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  get elementsEnum() {
    const findIdByName = (typeName: string) =>
      this.weaponTypes.find(({ name }) => name === typeName);

    return {
      TommyGun: findIdByName('TommyGun'),
      Shotgun: findIdByName('Shotgun'),
      RPG: findIdByName('RPG'),
      SniperRiffle: findIdByName('SniperRiffle'),
      Knife: findIdByName('Knife'),
      Pistol: findIdByName('Pistol'),
      SubmachineGun: findIdByName('SubmachineGun'),
    };
  }

  parseWeaponTypes() {
    this.finishedParsing = false;

    WeaponTypesApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (weaponTypes: WeaponType[]) => {
          this.weaponTypes = weaponTypes;
          this.finishedParsing = true;
          this.parsingError = null;
        }),
      )
      .catch(
        action('fetchError', (error: Error) => {
          this.finishedParsing = true;
          this.parsingError = error;
        }),
      );
  }
}

export const weaponTypesStore = new WeaponTypesStore();
