import { action, makeAutoObservable } from 'mobx';
import { SkinsApiClient } from '../api-client/skins/SkinsApiClient';
import type { Skin } from '../../types/Skin';

export class SkinsStore {
  skins: Skin[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseSkins() {
    this.finishedParsing = false;

    SkinsApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (skins: Skin[]) => {
          this.skins = skins;
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

export const skinsStore = new SkinsStore();
