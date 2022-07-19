import { action, makeAutoObservable } from 'mobx';
import { SkinTypesApiClient } from '../api-client/skins/SkinTypesApiClient';
import type { SkinType } from '../../types/SkinType';

export class SkinTypesStore {
  skinTypes: SkinType[] = [];
  parsingError: Error = null;
  finishedParsing = false;

  constructor() {
    makeAutoObservable(this);
  }

  get elementsEnum() {
    const findIdByName = (typeName: string) =>
      this.skinTypes.find(({ name }) => name === typeName);

    return {
      Skin: findIdByName('Skin'),
      Mouth: findIdByName('Mouth'),
      Eyesockets: findIdByName('Eyesockets'),
      Eyebrows: findIdByName('Eyebrows'),
      Eyes: findIdByName('Eyes'),
      Footprints: findIdByName('Footprints'),
    };
  }

  parseSkinTypes() {
    this.finishedParsing = false;

    SkinTypesApiClient.getAll()
      .then((response) => response.json())
      .then(
        action('fetchSuccess', (skinTypes: SkinType[]) => {
          this.skinTypes = skinTypes;
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

export const skinTypesStore = new SkinTypesStore();
