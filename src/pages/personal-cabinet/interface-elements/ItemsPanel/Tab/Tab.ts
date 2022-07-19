import { InterfaceElement } from '../../../../../types/InterfaceElement';

export class Tab extends InterfaceElement {
  protected label: Phaser.GameObjects.Text;
  protected image: Phaser.GameObjects.Image;

  constructor(label: string, protected readonly scene: Phaser.Scene) {
    super();

    this.image = scene.add.image(0, 0, 'tab').setInteractive();

    this.label = scene.add
      .text(0, 0, label)
      .setOrigin(0, 0.5)
      .setFontFamily('Montserrat')
      .setFontSize(22);
  }

  on(event: string, handler: () => void) {
    this.image.on(event, handler);
    return this;
  }

  protected updateScale() {
    this.image.setScale(this.scale);
    this.label.setScale(this.scale);
  }

  protected updatePosition() {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.image.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );
    this.label.setPosition(
      centerX + (this.position.x - 57) * this.scale,
      centerY + (this.position.y + 8) * this.scale,
    );
  }

  protected updateVisibility() {
    this.image.setVisible(this.visible);
    this.label.setVisible(this.visible);
  }

  setSelected(selected: boolean) {
    this.image.setTexture(selected ? 'tab-active' : 'tab');
    return this;
  }

  destroy() {
    this.image.destroy();
    this.label.destroy();
  }
}
