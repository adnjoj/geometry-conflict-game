import { action, makeAutoObservable } from 'mobx';
import { GamemodesApiClient } from '../api-client/gamemodes/GamemodesApiClient';
import type { Gamemode } from '../../types/Gamemode';

export class GamemodesStore {
  gamemodes: Gamemode[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseGamemodes() {
    this.finishedParsing = false;

    GamemodesApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (gamemodes: Gamemode[]) => {
          this.gamemodes = gamemodes;
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

export const gamemodesStore = new GamemodesStore();
