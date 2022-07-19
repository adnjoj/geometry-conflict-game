import type { GameScene } from '../../pages/game/scenes/Game';
import { GameWsApiClient } from '../api-client/game/GameWsApiClient';

export class MouseController {
  private readonly _mouseState = { x: 0, y: 0, pressedButtons: [] };

  constructor(private readonly _scene: GameScene) {}

  public onMouseDown(e: MouseEvent): void {
    const button = this.buttonCodeToString(e.button);
    if (!button) return;

    if (!this._mouseState.pressedButtons.includes(button)) {
      this._mouseState.pressedButtons.push(button);
    }

    this.updatePosition();
    this.sendData();
  }

  public onMouseUp(e: MouseEvent): void {
    const button = this.buttonCodeToString(e.button);
    if (!button) return;

    this._mouseState.pressedButtons.splice(
      this._mouseState.pressedButtons.indexOf(button),
      1,
    );

    this.updatePosition();
    this.sendData();
  }

  public onMouseMove(): void {
    this.updatePosition();
    this.sendData();
  }

  private buttonCodeToString(code: number): string {
    return ['LMB', 'MMB', 'RMB'][code] ?? null;
  }

  private updatePosition(): void {
    this._scene.input.mousePointer.updateWorldPoint(this._scene.cameras.main);
    this._mouseState.x =
      this._scene.input.mousePointer.worldX / this._scene.objectsScale;
    this._mouseState.y =
      this._scene.input.mousePointer.worldY / this._scene.objectsScale;
  }

  private sendData(): void {
    GameWsApiClient.emit('mouse_state', { mouseState: this._mouseState });
  }
}
