import type { GameScene } from '../scenes/Game';
import { GameObject } from './GameObject';

export class Image extends GameObject {
  public readonly image: Phaser.GameObjects.Image;

  constructor(scene: GameScene, texture: string, x: number, y: number) {
    super();
    this._position = { x, y };
    this.image = scene.add.image(x, y, texture);
  }

  public setTexture(texture: string): void {
    this.image.setTexture(texture);
  }

  public setDepth(depth: number): void {
    this.image.setDepth(depth + this.image.height / 4);
  }

  public setFlip(flip: { x: boolean; y: boolean }): void {
    this.image.setFlip(flip.x, flip.y);
  }

  public setAngle(angle: number): void {
    this.image.setAngle(angle);
  }

  protected updateScale(): void {
    this.image.setScale(this._scale / 2);
    this.updatePosition();
  }

  protected updatePosition(): void {
    this.image.setPosition(
      this._position.x * this._scale,
      this._position.y * this._scale,
    );
  }

  public destroy(): void {
    this.image.destroy();
  }
}
