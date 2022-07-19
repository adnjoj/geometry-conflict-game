import { InterfaceElement } from '../../../../../types/InterfaceElement';
import type { Image } from '../../Image/Image';

export abstract class TabContent extends InterfaceElement {
  protected destroyed = false;
  protected itemImages = new Array<Image>();

  constructor(protected readonly scene: Phaser.Scene) {
    super();
  }

  protected updateScale() {
    this.itemImages.forEach((itemImage) => itemImage.setScale(this.scale));
  }

  protected updatePosition() {
    this.itemImages.forEach((itemImage, index) => {
      itemImage.setPosition(
        this.position.x - 805 + index * 231,
        this.position.y + 1,
      );
    });
  }

  protected updateVisibility() {
    this.itemImages.forEach((itemImage) => itemImage.setVisible(this.visible));
  }

  destroy() {
    this.destroyed = true;
    this.itemImages.forEach((image) => image.destroy());
  }
}
