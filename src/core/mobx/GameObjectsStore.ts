import { action, makeAutoObservable } from 'mobx';
import type { GameObject } from '../../types/GameObject';

import { GameObjectsApiClient } from '../api-client/game-objects/GameObjectsApiClient';

export class GameObjectsStore {
  gameObjects: GameObject[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseGameObjects() {
    this.finishedParsing = false;

    GameObjectsApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (gameObjects: GameObject[]) => {
          this.gameObjects = gameObjects;
          this.finishedParsing = true;
          this.parsingError = null;
        }),
      )
      .catch(
        action('fetchError', (error: Error) => {
          this.parsingError = error;
        }),
      );
  }
}

export const gameObjectsStore = new GameObjectsStore();
