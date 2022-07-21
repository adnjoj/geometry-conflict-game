import { autorun } from 'mobx';
import { ApiClient } from '../../../core/api-client/ApiClient';

import { clipsStore } from '../../../core/mobx/ClipsStore';
import { fractionsStore } from '../../../core/mobx/FractionsStore';
import { mapsStore } from '../../../core/mobx/MapsStore';
import { skinsStore } from '../../../core/mobx/SkinsStore';
import { specialitiesStore } from '../../../core/mobx/SpecialitiesStore';
import { weaponsStore } from '../../../core/mobx/WeaponsStore';

export class CabinetResourceLoader {
  constructor(private readonly _loader: Phaser.Loader.LoaderPlugin) {}

  load() {
    this._loader.image('empty', 'images/empty.png');
    this._loader.image('check-mark', 'images/check-mark.png');

    const interfaceImages = {
      background: 'bg.png',
      tab: 'tab.png',
      'tab-active': 'tab-active.png',
      'character-screen-bg': 'character-screen-bg.png',
      'fraction-screen-bg': 'fraction-bg.png',
      'speciality-screen-bg': 'speciality-bg.png',
      'items-panel': 'items-panel.png',
      'user-equipment-panel': 'user-equipment-panel.png',
    };

    Object.entries(interfaceImages).forEach(([key, filename]) => {
      this._loader.image(key, `images/cabinet/main-interface/${filename}`);
    });

    const buttonImages = {
      arrow: 'arrow.png',
      'start-button': 'start.png',
      'start-button-pressed': 'start-pressed.png',
      'skins-button': 'skin.png',
      'skins-button-pressed': 'skin-pressed.png',
      'weapons-button': 'weapon.png',
      'weapons-button-pressed': 'weapon-pressed.png',
      'gamemodes-button': 'mode.png',
      'gamemodes-button-pressed': 'mode-pressed.png',
    };

    Object.entries(buttonImages).forEach(([key, filename]) => {
      this._loader.image(key, `images/cabinet/buttons/${filename}`);
    });

    this.loadFractions();
    this.loadSpecialities();
    this.loadWeapons();
    this.loadClips();
    this.loadSkins();
    this.loadMaps();
  }

  private loadFractions() {
    autorun(() => {
      if (fractionsStore.finishedParsing) {
        fractionsStore.fractions.forEach(({ name }) => {
          this._loader.image(
            `fraction-${name}`,
            `images/cabinet/fraction-icons/${name}.png`,
          );
        });

        this._loader.start();
      }
    });
  }

  private loadSpecialities() {
    autorun(() => {
      if (specialitiesStore.finishedParsing) {
        specialitiesStore.specialities.forEach(({ name }) => {
          this._loader.image(
            `speciality-${name}`,
            `images/cabinet/speciality-icons/${name}.png`,
          );
        });

        this._loader.start();
      }
    });
  }

  private loadWeapons() {
    autorun(() => {
      if (weaponsStore.finishedParsing) {
        weaponsStore.weapons.forEach(({ id }) => {
          const weaponDir = `${ApiClient.SERVER_HOST}/weapons/${id}`;

          this._loader.image(`weapon-${id}`, `${weaponDir}/weaponImage.png`);
          this._loader.image(`weapon-${id}-fire`, `${weaponDir}/fireImage.png`);
          this._loader.image(
            `weapon-${id}-bullet`,
            `${weaponDir}/bulletImage.png`,
          );

          this._loader.audio(`weapon-${id}-shot`, `${weaponDir}/shotSound.mp3`);
          this._loader.audio(
            `weapon-${id}-reload`,
            `${weaponDir}/reloadSound.mp3`,
          );
        });

        this._loader.start();
      }
    });
  }

  private loadClips() {
    autorun(() => {
      if (clipsStore.finishedParsing) {
        clipsStore.clips.forEach(({ id }) => {
          this._loader.image(
            `clip-${id}`,
            `${ApiClient.SERVER_HOST}/clips/${id}/clipImage.png`,
          );
        });

        this._loader.start();
      }
    });
  }

  private loadSkins() {
    autorun(() => {
      if (skinsStore.finishedParsing) {
        skinsStore.skins.forEach(({ id }) => {
          this._loader.image(
            `skin-${id}`,
            `${ApiClient.SERVER_HOST}/skins/${id}/skinImage.png`,
          );
        });

        this._loader.start();
      }
    });
  }

  private loadMaps() {
    autorun(() => {
      if (mapsStore.finishedParsing) {
        mapsStore.maps.forEach(({ id }) => {
          this._loader.image(
            `map-${id}`,
            `${ApiClient.SERVER_HOST}/maps/${id}/mapImage.png`,
          );
        });

        this._loader.start();
      }
    });
  }
}
