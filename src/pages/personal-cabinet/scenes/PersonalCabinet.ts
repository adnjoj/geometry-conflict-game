import { Scene } from 'phaser';
import { autorun } from 'mobx';
import type { InterfaceElement } from '../../../types/InterfaceElement';

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../../constants/size';

import { ApiClient } from '../../../core/api-client/ApiClient';

import { fractionsStore } from '../../../core/mobx/FractionsStore';
import { specialitiesStore } from '../../../core/mobx/SpecialitiesStore';
import { weaponsStore } from '../../../core/mobx/WeaponsStore';
import { weaponTypesStore } from '../../../core/mobx/WeaponTypesStore';
import { clipsStore } from '../../../core/mobx/ClipsStore';
import { skinsStore } from '../../../core/mobx/SkinsStore';
import { skinTypesStore } from '../../../core/mobx/SkinTypesStore';
import { cabinetStore } from '../../../core/mobx/CabinetStore';
import { mapsStore } from '../../../core/mobx/MapsStore';
import { gamemodesStore } from '../../../core/mobx/GamemodesStore';

import { Background } from '../interface-elements/Background/Background';
import { CharacterScreen } from '../interface-elements/CharacterScreen/CharacterScreen';
import { FractionScreen } from '../interface-elements/FractionScreen/FractionScreen';
import { SpecialityScreen } from '../interface-elements/SpecialityScreen/SpecialityScreen';
import { UserEquipmentPanel } from '../interface-elements/UserEquipmentPanel/UserEquipmentPanel';
import { StartButton } from '../interface-elements/StartButton/StartButton';
import { ActivitiesMenu } from '../interface-elements/ActivitiesMenu/ActivitiesMenu';
import { ItemsPanel } from '../interface-elements/ItemsPanel/ItemsPanel';
import { EquipmentPanel } from '../interface-elements/ItemsPanel/EquipmentPanel/EquipmentPanel';
import { LookPanel } from '../interface-elements/ItemsPanel/LookPanel/LookPanel';
import { MapsPanel } from '../interface-elements/ItemsPanel/MapsPanel/MapsPanel';
import { LobbiesMenu } from '../interface-elements/LobbiesMenu/LobbiesMenu';

fractionsStore.parseFractions();
specialitiesStore.parseSpecialities();
weaponsStore.parseWeapons();
weaponTypesStore.parseWeaponTypes();
clipsStore.parseClips();
skinsStore.parseSkins();
skinTypesStore.parseSkinTypes();
mapsStore.parseMaps();
gamemodesStore.parseGamemodes();
cabinetStore.parseData();

export class PersonalCabinetScene extends Scene {
  private interfaceElements: InterfaceElement[] = [];

  preload() {
    this.load.image('check-mark', 'images/check-mark.png');
    this.load.image('empty', 'images/empty.png');

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
      this.load.image(key, `images/cabinet/main-interface/${filename}`);
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
      this.load.image(key, `images/cabinet/buttons/${filename}`);
    });

    autorun(() => {
      if (specialitiesStore.finishedParsing) {
        specialitiesStore.specialities.forEach(({ name }) => {
          this.load.image(
            `speciality-${name}`,
            `images/cabinet/speciality-icons/${name}.png`,
          );
        });

        this.load.start();
      }
    });

    autorun(() => {
      if (fractionsStore.finishedParsing) {
        fractionsStore.fractions.forEach(({ name }) => {
          this.load.image(
            `fraction-${name}`,
            `images/cabinet/fraction-icons/${name}.png`,
          );
        });

        this.load.start();
      }
    });

    autorun(() => {
      if (weaponsStore.finishedParsing) {
        weaponsStore.weapons.forEach(({ id }) => {
          this.load.image(
            `weapon-${id}`,
            `${ApiClient.SERVER_HOST}/weapons/${id}/weaponImage.png`,
          );
        });

        this.load.start();
      }
    });

    autorun(() => {
      if (clipsStore.finishedParsing) {
        clipsStore.clips.forEach(({ id }) => {
          this.load.image(
            `clip-${id}`,
            `${ApiClient.SERVER_HOST}/clips/${id}/clipImage.png`,
          );
        });

        this.load.start();
      }
    });

    autorun(() => {
      if (skinsStore.finishedParsing) {
        skinsStore.skins.forEach(({ id }) => {
          this.load.image(
            `skin-${id}`,
            `${ApiClient.SERVER_HOST}/skins/${id}/skinImage.png`,
          );
        });

        this.load.start();
      }
    });

    autorun(() => {
      if (mapsStore.finishedParsing) {
        mapsStore.maps.forEach(({ id }) => {
          this.load.image(
            `map-${id}`,
            `${ApiClient.SERVER_HOST}/maps/${id}/mapImage.png`,
          );
        });

        this.load.start();
      }
    });
  }

  create() {
    this.interfaceElements = [
      new Background(this).setPosition(0, 0),
      new CharacterScreen(this).setPosition(-9, -143),
      new FractionScreen(this).setPosition(698, -246),
      new SpecialityScreen(this).setPosition(698, -370),
      new UserEquipmentPanel(this).setPosition(-6, 113),
      new EquipmentPanel(this).setPosition(0, 404),
      new LookPanel(this).setPosition(0, 404),
      new MapsPanel(this).setPosition(0, 404),
      new StartButton(this).setPosition(-680, -427),
      new ActivitiesMenu(this).setPosition(-706, 95),
      new LobbiesMenu(this).setPosition(-9, -143).setVisible(false),
    ];

    autorun(() => {
      const { currentActivity } = cabinetStore;

      this.interfaceElements.forEach((el) => {
        if (el instanceof ItemsPanel) el.setVisible(false);
        const ActivePanelType = [EquipmentPanel, LookPanel, MapsPanel][
          currentActivity
        ];

        if (el instanceof ActivePanelType) {
          el.setVisible(true);
        }
      });
    });

    const updateInterfaceElementsScale = () => {
      const widthScale = this.scale.width / DEFAULT_WIDTH;
      const heightScale = this.scale.height / DEFAULT_HEIGHT;
      const scale = Math.min(widthScale, heightScale);

      this.interfaceElements.forEach((el) => el.setScale(scale));
    };

    updateInterfaceElementsScale();
    this.scale.on('resize', updateInterfaceElementsScale);
  }

  setLobbiesMenuVisible(visible: boolean) {
    this.interfaceElements.forEach((el) => {
      if (el instanceof LobbiesMenu) el.setVisible(visible);
      if (el instanceof CharacterScreen) el.setVisible(!visible);
    });
  }
}
