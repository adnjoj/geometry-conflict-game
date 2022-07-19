import { autorun } from 'mobx';
import { Scene } from 'phaser';
import { navigate } from 'svelte-routing';

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../../constants/size';

import { ApiClient } from '../../../core/api-client/ApiClient';
import { GameWsApiClient } from '../../../core/api-client/game/GameWsApiClient';
import { GameObjectGateway } from '../../../core/game/GameObjectsGateway';
import { KeyboardController } from '../../../core/game/KeyboardController';
import { MouseController } from '../../../core/game/MouseController';

import { clipsStore } from '../../../core/mobx/ClipsStore';
import { gameObjectsStore } from '../../../core/mobx/GameObjectsStore';
import { skinsStore } from '../../../core/mobx/SkinsStore';
import { weaponsStore } from '../../../core/mobx/WeaponsStore';

import type { InterfaceElement } from '../../../types/InterfaceElement';
import type { GameObject } from '../game-objects/GameObject';
import type { Image } from '../game-objects/Image';
import { GameOverScreen } from '../interface-elements/GameOverScreen/GameOverScreen';

import { InteractionMenu } from '../interface-elements/InteractionMenu/InteractionMenu';
import { Inventory } from '../interface-elements/Inventory/Inventory';
import { InventorySidePanel } from '../interface-elements/InventorySidePanel/InventorySidePanel';
import { LoadingScreen } from '../interface-elements/LoadingScreen/LoadingScreen';

weaponsStore.parseWeapons();
clipsStore.parseClips();
skinsStore.parseSkins();
gameObjectsStore.parseGameObjects();

export class GameScene extends Scene {
  public objectsScale = 1;

  public readonly gameObjects = new Map<number, GameObject>();
  public readonly interfaceElements = new Map<string, InterfaceElement>();

  private _playerId: number;
  private _player: Image;
  private readonly _keyboardController = new KeyboardController(this);
  private readonly _mouseController = new MouseController(this);

  preload() {
    if (!localStorage.lobbyToken) navigate('/');

    this.load.image('empty', 'images/empty.png');
    this.load.image('inventory-bg', 'images/game/inventory-bg.png');
    this.load.image(
      'interaction-menu-option-bg',
      'images/game/interaction-menu-option-bg.png',
    );
    this.load.image(
      'interaction-menu-option-active-bg',
      'images/game/interaction-menu-option-active-bg.png',
    );
    this.load.image(
      'inventory-side-panel-element-bg',
      'images/game/inventory-side-panel-element-bg.png',
    );
    this.load.image(
      'inventory-side-panel-element-active-bg',
      'images/game/inventory-side-panel-element-active-bg.png',
    );
    this.load.image('game-over-bg', 'images/game/game-over-bg.png');

    [
      'flags/red/flagImage.png',
      'flags/magenta/flagImage.png',
      'flags/yellow/flagImage.png',
      'flags/blue/flagImage.png',
    ].forEach((flag) => {
      this.load.image(flag, `${ApiClient.SERVER_HOST}/${flag}`);
    });

    autorun(() => {
      weaponsStore.weapons.forEach(({ id }) => {
        const folder = `weapons/${id}`;
        const images = ['weaponImage.png', 'fireImage.png', 'bulletImage.png'];
        const audio = ['shotSound.mp3', 'reloadSound.mp3'];

        for (const filename of images) {
          const filePath = `${folder}/${filename}`;
          this.load.image(filePath, `${ApiClient.SERVER_HOST}/${filePath}`);
        }

        for (const filename of audio) {
          const filePath = `${folder}/${filename}`;
          this.load.audio(filePath, `${ApiClient.SERVER_HOST}/${filePath}`);
        }
      });
    });

    autorun(() => {
      clipsStore.clips.forEach(({ id }) => {
        const filePath = `clips/${id}/clipImage.png`;
        this.load.image(filePath, `${ApiClient.SERVER_HOST}/${filePath}`);
      });
    });

    autorun(() => {
      skinsStore.skins.forEach(({ id }) => {
        const filePath = `skins/${id}/skinImage.png`;
        this.load.image(filePath, `${ApiClient.SERVER_HOST}/${filePath}`);
      });
    });

    autorun(() => {
      gameObjectsStore.gameObjects.forEach(({ id }) => {
        const filePath = `game-objects/${id}/gameObjectImage.png`;
        this.load.image(filePath, `${ApiClient.SERVER_HOST}/${filePath}`);
      });
    });
  }

  create() {
    this.cameras.main.setScroll(
      -window.innerWidth / 2,
      -window.innerHeight / 2,
    );

    GameWsApiClient.openSocket();

    GameWsApiClient.emit('initialize', { token: localStorage.lobbyToken });
    GameWsApiClient.on('token_verification_failed', () => navigate('/'));

    delete localStorage.lobbyToken;

    const inventory = new Inventory(this).setVisible(false);
    this.interfaceElements.set('inventory', inventory);

    const inventorySidePanel = new InventorySidePanel(this);
    this.interfaceElements.set('inventorySidePanel', inventorySidePanel);

    const interactionMenu = new InteractionMenu(this);
    this.interfaceElements.set('interactionMenu', interactionMenu);

    const loadingScreen = new LoadingScreen(this);
    this.interfaceElements.set('loadingScreen', loadingScreen);

    const gameOverScreen = new GameOverScreen(this).setVisible(false);
    this.interfaceElements.set('gameOverScreen', gameOverScreen);

    window.onkeydown = (e) => this._keyboardController.onKeyDown(e);
    window.onkeyup = (e) => this._keyboardController.onKeyUp(e);

    window.onmousedown = (e) => this._mouseController.onMouseDown(e);
    window.onmouseup = (e) => this._mouseController.onMouseUp(e);

    const gameObjectsGateway = new GameObjectGateway(this);

    GameWsApiClient.on('game_object_created', (data) =>
      gameObjectsGateway.handleCreated(data),
    );

    GameWsApiClient.on('game_objects_updated', (data) => {
      loadingScreen.setVisible(false);
      gameObjectsGateway.handleUpdated(data);
    });

    GameWsApiClient.on('game_object_destroyed', (data) =>
      gameObjectsGateway.handleDestroyed(data),
    );

    GameWsApiClient.on('player_id', ({ id }) => {
      this._playerId = id;
      const playerObject = this.gameObjects.get(id) as Image;

      if (playerObject) this.cameras.main.startFollow(playerObject.image);
      else gameObjectsGateway.playerId = id;
    });

    GameWsApiClient.on('inventory_updated', ({ weapons, clips, ...other }) => {
      inventory.setItems([
        ...weapons,
        ...clips,
        ...Object.values(other).flat(),
      ]);

      inventorySidePanel.setWeapons(weapons);
      inventorySidePanel.setClips(clips);
    });

    GameWsApiClient.on('weapon_switched', ({ slot }) => {
      inventorySidePanel.setSelectedWeaponSlot(slot);
    });

    GameWsApiClient.on(
      'available_interactions',
      ({ availableInteractions }) => {
        interactionMenu.setOptions(availableInteractions);
      },
    );

    GameWsApiClient.on('game_over', ({ winnerFraction, membersData }) => {
      gameOverScreen.setVisible(true);
      gameOverScreen.setWinnerFraction(winnerFraction);
      gameOverScreen.setPlayers(membersData);
    });

    this.updateInterfaceElementsScale();
    this.scale.on('resize', this.updateInterfaceElementsScale.bind(this));
  }

  update() {
    this.gameObjects.forEach((gameObject) => {
      gameObject.update();
    });

    this._mouseController.onMouseMove();

    if (!this._player) {
      this._player = this.gameObjects.get(this._playerId) as Image;
    }
    if (!this._player) return;

    this.interfaceElements.forEach((element) => {
      // Substract half of window size because interface elements count
      // coordinates as if (0; 0) point is in the top left corner of the window
      // but here (0; 0) is in the center of the window

      element.setPosition(
        (this._player.image.x - this.scale.width / 2) / this.objectsScale,
        (this._player.image.y - this.scale.height / 2) / this.objectsScale,
      );
    });
  }

  updateInterfaceElementsScale() {
    const widthScale = this.scale.width / DEFAULT_WIDTH;
    const heightScale = this.scale.height / DEFAULT_HEIGHT;
    const scale = Math.min(widthScale, heightScale) * 1.2;
    this.objectsScale = scale;

    this.gameObjects.forEach((gameObject) => gameObject.setScale(scale));
    this.interfaceElements.forEach((element) => element.setScale(scale));
  }
}
