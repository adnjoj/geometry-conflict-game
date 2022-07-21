import type { GameScene } from '../scenes/Game';
import { GameObject } from './GameObject';

export class Text extends GameObject {
  public readonly text: Phaser.GameObjects.Text;

  constructor(scene: GameScene, text: string, x: number, y: number) {
    super();
    this._position = { x, y };
    this.text = scene.add.text(x, y, text).setOrigin(0.5, 0.5);
  }

  public setText(text: string): void {
    this.text.setText(text);
  }

  public setFontFamily(fontFamily: string): void {
    this.text.setFontFamily(fontFamily);
  }

  public setFontSize(fontSize: number): void {
    this.text.setFontSize(fontSize);
  }

  public setDepth(depth: number): void {
    this.text.setDepth(depth);
  }

  public setFlip(flip: { x: boolean; y: boolean }): void {
    this.text.setFlip(flip.x, flip.y);
  }

  public setAngle(angle: number): void {
    this.text.setAngle(angle);
  }

  protected updateScale(): void {
    this.text.setScale(this._scale / 2);
    this.updatePosition();
  }

  protected updatePosition(): void {
    this.text.setPosition(
      this._position.x * this._scale,
      this._position.y * this._scale,
    );
  }

  public destroy(): void {
    this.text.destroy();
  }
}
