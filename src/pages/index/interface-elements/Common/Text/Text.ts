import { InterfaceElement } from '../../../../../types/InterfaceElement';

export class Text extends InterfaceElement {
  protected text: Phaser.GameObjects.Text;

  constructor(protected readonly scene: Phaser.Scene, text: string) {
    super();
    this.text = scene.add.text(0, 0, text).setInteractive().setOrigin(0, 0.5);
  }

  on(event: string, handler: () => void) {
    this.text.on(event, handler);
    return this;
  }

  protected updateScale() {
    this.text.setScale(this.scale);
  }

  protected updatePosition() {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.text.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );
  }

  protected updateVisibility() {
    this.text.setVisible(this.visible);
  }

  setOrigin(x: number, y: number): Text {
    this.text.setOrigin(x, y);
    return this;
  }

  setAngle(angle: number) {
    this.text.setAngle(angle);
    return this;
  }

  setFont(fontFamily: string, fontSize: number) {
    this.text.setFontFamily(fontFamily);
    this.text.setFontSize(fontSize);
    return this;
  }

  setColor(color: string) {
    this.text.setColor(color);
    return this;
  }

  setText(text: string) {
    this.text.setText(text);
    return this;
  }

  cutByMaxLength(length: number) {
    const { text } = this.text;
    if (text.length <= length) return this;

    this.text.setText(`${this.text.text.slice(0, length)}...`);
    return this;
  }

  setDepth(depth: number) {
    this.text.setDepth(depth);
    this.update();
    return this;
  }

  setFlip(flip: boolean) {
    this.text.setFlipX(flip);
    this.update();
    return this;
  }

  destroy() {
    this.text.destroy();
    return this;
  }
}
