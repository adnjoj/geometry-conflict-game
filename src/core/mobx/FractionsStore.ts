import { action, makeAutoObservable } from 'mobx';
import { FractionsApiClient } from '../api-client/fractions/FractionsApiClient';
import type { Fraction } from '../../types/Fraction';

export class FractionsStore {
  fractions: Fraction[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseFractions() {
    this.finishedParsing = false;

    FractionsApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (fractions: Fraction[]) => {
          this.fractions = fractions;
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

export const fractionsStore = new FractionsStore();
