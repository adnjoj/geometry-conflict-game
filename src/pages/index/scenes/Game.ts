import { autorun } from 'mobx';
import { Scene } from 'phaser';

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

import { GameOverScreen } from '../interface-elements/Game/GameOverScreen/GameOverScreen';
import { InteractionMenu } from '../interface-elements/Game/InteractionMenu/InteractionMenu';
import { Inventory } from '../interface-elements/Game/Inventory/Inventory';
import { InventorySidePanel } from '../interface-elements/Game/InventorySidePanel/InventorySidePanel';
import { LoadingScreen } from '../interface-elements/Game/LoadingScreen/LoadingScreen';

export class GameScene extends Scene {
  public objectsScale = 1;

  public readonly gameObjects = new Map<number, GameObject>();
  public readonly interfaceElements = new Map<string, InterfaceElement>();

  private _playerId: number;
  private _player: Image;
  private readonly _keyboardController = new KeyboardController(this);
  private readonly _mouseController = new MouseController(this);

  constructor() {
    super('Game');
  }

  toCabinet() {
    this.scene.start('PersonalCabinet');
  }

  preload() {
    if (!localStorage.lobbyToken) this.toCabinet();

    weaponsStore.parseWeapons();
    clipsStore.parseClips();
    skinsStore.parseSkins();
    gameObjectsStore.parseGameObjects();
  }

  create() {
    this.cameras.main.setScroll(
      -window.innerWidth / 2,
      -window.innerHeight / 2,
    );

    GameWsApiClient.openSocket();

    GameWsApiClient.emit('initialize', { token: localStorage.lobbyToken });
    GameWsApiClient.on('token_verification_failed', () => this.toCabinet());

    delete localStorage.lobbyToken;

    const inventory = new Inventory(this).setVisible(false);
    this.interfaceElements.set('inventory', inventory);

    const inventorySidePanel = new InventorySidePanel(this);
    this.interfaceElements.set('inventorySidePanel', inventorySidePanel);

    const interactionMenu = new InteractionMenu(this);
    this.interfaceElements.set('interactionMenu', interactionMenu);

    const gameOverScreen = new GameOverScreen(this).setVisible(false);
    this.interfaceElements.set('gameOverScreen', gameOverScreen);

    const loadingScreen = new LoadingScreen(this);
    this.interfaceElements.set('loadingScreen', loadingScreen);

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
