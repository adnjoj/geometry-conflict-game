import type { GameScene } from '../../pages/index/scenes/Game';
import { GameWsApiClient } from '../api-client/game/GameWsApiClient';

export class KeyboardController {
  private readonly _pressedKeys = new Array<string>();

  constructor(private readonly _scene: GameScene) {}

  public onKeyDown(e: KeyboardEvent): void {
    const inventory = this._scene.interfaceElements.get('inventory');

    if (!this._pressedKeys.includes(e.code)) this._pressedKeys.push(e.code);

    if (e.code === 'KeyI') inventory?.setVisible(!inventory?.visible);

    this.sendPressedKeys(inventory?.visible);
  }

  public onKeyUp(e: KeyboardEvent): void {
    const inventory = this._scene.interfaceElements.get('inventory');

    this._pressedKeys.splice(this._pressedKeys.indexOf(e.code), 1);

    this.sendPressedKeys(inventory?.visible);
  }

  private sendPressedKeys(inputIsBlocked: boolean): void {
    if (!inputIsBlocked) {
      GameWsApiClient.emit('pressed_keys', { pressedKeys: this._pressedKeys });
    } else {
      GameWsApiClient.emit('pressed_keys', { pressedKeys: [] });
    }
  }
}
