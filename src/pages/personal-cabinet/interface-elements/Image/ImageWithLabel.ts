import { Image } from './Image';

export class ImageWithLabel extends Image {
  protected _label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, texture: string, label: string) {
    super(scene, texture);

    this._label = scene.add
      .text(0, 0, label)
      .setOrigin(0.5, 0.5)
      .setStroke('black', 4)
      .setFontFamily('Montserrat')
      .setFontSize(24)
      .setDepth(1);
  }

  protected updateScale() {
    super.updateScale();
    this._label.setScale(this.scale);
  }

  protected updatePosition() {
    super.updatePosition();

    const centerX = this._scene.scale.width / 2;
    const centerY = this._scene.scale.height / 2;

    this._label.setPosition(
      centerX + (this.position.x + this.size.w / 2) * this.scale,
      centerY + (this.position.y + this.size.h / 2) * this.scale,
    );
  }

  protected updateVisibility() {
    super.updateVisibility();
    this._label.setVisible(this.visible);
  }

  destroy() {
    super.destroy();
    this._label.destroy();
    return this;
  }
}
