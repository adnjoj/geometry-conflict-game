import { action, makeAutoObservable } from 'mobx';
import { ClipsApiClient } from '../api-client/clips/ClipsApiClient';
import type { Clip } from '../../types/Clip';

export class ClipsStore {
  clips: Clip[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseClips() {
    this.finishedParsing = false;

    ClipsApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (clips: Clip[]) => {
          this.clips = clips;
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

export const clipsStore = new ClipsStore();
