import { autorun } from 'mobx';
import { ApiClient } from '../../../core/api-client/ApiClient';

import { gameObjectsStore } from '../../../core/mobx/GameObjectsStore';

export class GameResourceLoader {
  constructor(private readonly _loader: Phaser.Loader.LoaderPlugin) {}

  load() {
    const interfaceImages = {
      'inventory-bg': 'inventory-bg.png',
      'interaction-menu-option-bg': 'interaction-menu-option-bg.png',
      'interaction-menu-option-active-bg':
        'interaction-menu-option-active-bg.png',
      'inventory-side-panel-element-bg': 'inventory-side-panel-element-bg.png',
      'inventory-side-panel-element-active-bg':
        'inventory-side-panel-element-active-bg.png',
      'game-over-bg': 'game-over-bg.png',
    };

    Object.entries(interfaceImages).forEach(([key, filename]) => {
      this._loader.image(key, `images/game/${filename}`);
    });

    const flagImages = {
      'flag-red': 'flags/red/flagImage.png',
      'flag-magenta': 'flags/magenta/flagImage.png',
      'flag-yellow': 'flags/yellow/flagImage.png',
      'flag-blue': 'flags/blue/flagImage.png',
    };

    Object.entries(flagImages).forEach(([key, filename]) => {
      this._loader.image(key, `${ApiClient.SERVER_HOST}/${filename}`);
    });

    this.loadGameObjects();
  }

  private loadGameObjects() {
    autorun(() => {
      gameObjectsStore.gameObjects.forEach(({ id }) => {
        this._loader.image(
          `game-object-${id}`,
          `${ApiClient.SERVER_HOST}/game-objects/${id}/gameObjectImage.png`,
        );
      });
    });
  }
}
