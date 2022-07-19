import { InterfaceElement } from '../../../../types/InterfaceElement';

export class LoadingScreen extends InterfaceElement {
  private _background: Phaser.GameObjects.Rectangle;
  private _text: Phaser.GameObjects.Text;

  constructor(private readonly _scene: Phaser.Scene) {
    super();
    this._background = _scene.add
      .rectangle(0, 0, 10000, 10000, 0x2d2d2d)
      .setDepth(1000000);

    this._text = _scene.add
      .text(0, 0, 'Ожидайте начала игры')
      .setFontFamily('Montserrat')
      .setFontSize(72)
      .setDepth(1000000)
      .setOrigin(0.5, 0.5)
      .setVisible(false);
  }

  protected updatePosition(): void {
    const centerX = this._scene.scale.width / 2;
    const centerY = this._scene.scale.height / 2;

    this._background.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );

    this._text.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );

    if (this.position.x !== 0) this.updateVisibility();
  }

  protected updateScale(): void {
    this._background.setScale(this.scale);
    this._text.setScale(this.scale);
  }

  protected updateVisibility(): void {
    this._background.setVisible(this.visible);
    this._text.setVisible(this.visible);
  }
}
