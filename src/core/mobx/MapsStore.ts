import { action, makeAutoObservable } from 'mobx';
import { MapsApiClient } from '../api-client/maps/MapsApiClient';
import type { Map } from '../../types/Map';

export class MapsStore {
  maps: Map[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseMaps() {
    this.finishedParsing = false;

    MapsApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (maps: Map[]) => {
          this.maps = maps;
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

export const mapsStore = new MapsStore();
