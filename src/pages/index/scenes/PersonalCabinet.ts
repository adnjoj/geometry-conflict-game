import { Scene } from 'phaser';
import { autorun } from 'mobx';
import type { InterfaceElement } from '../../../types/InterfaceElement';

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../../constants/size';

import { CabinetResourceLoader } from '../resource-loaders/CabinetResourceLoader';
import { GameResourceLoader } from '../resource-loaders/GameResourceLoader';

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
import { gameObjectsStore } from '../../../core/mobx/GameObjectsStore';

import { Background } from '../interface-elements/PersonalCabinet/Background/Background';
import { CharacterScreen } from '../interface-elements/PersonalCabinet/CharacterScreen/CharacterScreen';
import { FractionScreen } from '../interface-elements/PersonalCabinet/FractionScreen/FractionScreen';
import { SpecialityScreen } from '../interface-elements/PersonalCabinet/SpecialityScreen/SpecialityScreen';
import { UserEquipmentPanel } from '../interface-elements/PersonalCabinet/UserEquipmentPanel/UserEquipmentPanel';
import { StartButton } from '../interface-elements/PersonalCabinet/StartButton/StartButton';
import { ActivitiesMenu } from '../interface-elements/PersonalCabinet/ActivitiesMenu/ActivitiesMenu';
import { ItemsPanel } from '../interface-elements/PersonalCabinet/ItemsPanel/ItemsPanel';
import { EquipmentPanel } from '../interface-elements/PersonalCabinet/ItemsPanel/EquipmentPanel/EquipmentPanel';
import { LookPanel } from '../interface-elements/PersonalCabinet/ItemsPanel/LookPanel/LookPanel';
import { MapsPanel } from '../interface-elements/PersonalCabinet/ItemsPanel/MapsPanel/MapsPanel';
import { LobbiesMenu } from '../interface-elements/PersonalCabinet/LobbiesMenu/LobbiesMenu';

export class PersonalCabinetScene extends Scene {
  private interfaceElements: InterfaceElement[] = [];

  constructor() {
    super('PersonalCabinet');
  }

  preload() {
    fractionsStore.parseFractions();
    specialitiesStore.parseSpecialities();
    weaponsStore.parseWeapons();
    weaponTypesStore.parseWeaponTypes();
    clipsStore.parseClips();
    skinsStore.parseSkins();
    skinTypesStore.parseSkinTypes();
    mapsStore.parseMaps();
    gameObjectsStore.parseGameObjects();
    gamemodesStore.parseGamemodes();
    cabinetStore.parseData();

    new CabinetResourceLoader(this.load).load();
    new GameResourceLoader(this.load).load();
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

  startGame() {
    this.scene.start('Game');
  }
}
