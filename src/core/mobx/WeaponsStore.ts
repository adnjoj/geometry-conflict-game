import { action, makeAutoObservable } from 'mobx';
import { WeaponsApiClient } from '../api-client/weapons/WeaponsApiClient';
import type { Weapon } from '../../types/Weapon';

export class WeaponsStore {
  weapons: Weapon[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseWeapons() {
    this.finishedParsing = false;

    WeaponsApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (weapons: Weapon[]) => {
          this.weapons = weapons;
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

export const weaponsStore = new WeaponsStore();
