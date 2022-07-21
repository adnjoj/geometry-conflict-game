import { InterfaceElement } from '../../../../../types/InterfaceElement';

export class Background extends InterfaceElement {
  private backgroundImage: Phaser.GameObjects.Image;

  constructor(private readonly scene: Phaser.Scene) {
    super();
    this.backgroundImage = this.scene.add.image(0, 0, 'background');
  }

  protected updateScale(): void {
    this.backgroundImage.setScale(this.scale);
  }

  protected updatePosition(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.backgroundImage.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );
  }

  protected updateVisibility(): void {
    this.backgroundImage.setVisible(this.visible);
  }
}
