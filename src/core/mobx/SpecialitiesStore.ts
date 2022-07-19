import { action, makeAutoObservable } from 'mobx';
import { SpecialitiesApiClient } from '../api-client/specialities/SpecialitiesApiClient';
import type { Speciality } from '../../types/Speciality';

export class SpecialitiesStore {
  specialities: Speciality[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  parseSpecialities() {
    this.finishedParsing = false;

    SpecialitiesApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (specialities: Speciality[]) => {
          this.specialities = specialities;
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

export const specialitiesStore = new SpecialitiesStore();
