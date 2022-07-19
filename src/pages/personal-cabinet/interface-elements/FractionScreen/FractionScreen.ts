import { autorun } from 'mobx';
import { InterfaceElement } from '../../../../types/InterfaceElement';
import { Image } from '../Image/Image';

import { fractionsStore } from '../../../../core/mobx/FractionsStore';
import { cabinetStore } from '../../../../core/mobx/CabinetStore';

export class FractionScreen extends InterfaceElement {
  private backgroundImage: Phaser.GameObjects.Image;
  private prevArrow: Phaser.GameObjects.Image;
  private nextArrow: Phaser.GameObjects.Image;
  private selectedFractionImage: Image;

  constructor(private readonly scene: Phaser.Scene) {
    super();

    this.backgroundImage = this.scene.add.image(0, 0, 'fraction-screen-bg');
    this.prevArrow = this.scene.add.image(0, 0, 'arrow');
    this.nextArrow = this.scene.add.image(0, 0, 'arrow');

    this.selectedFractionImage = new Image(scene, 'empty').setSize(70, 70);

    this.nextArrow.setFlipX(true);

    this.nextArrow
      .setInteractive()
      .on('pointerdown', this.nextFraction.bind(this));
    this.prevArrow
      .setInteractive()
      .on('pointerdown', this.prevFraction.bind(this));

    autorun(() => {
      const search = ({ id }) => id === cabinetStore.selectedFraction;
      const fractionName = fractionsStore.fractions.find(search)?.name ?? '';

      this.selectedFractionImage.setTexture(`fraction-${fractionName}`);
    });
  }

  protected updateScale(): void {
    this.backgroundImage.setScale(this.scale);
    this.prevArrow.setScale(this.scale);
    this.nextArrow.setScale(this.scale);
    this.selectedFractionImage.setScale(this.scale);
  }

  protected updatePosition(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    const blockX = centerX + this.position.x * this.scale;
    const blockY = centerY + this.position.y * this.scale;

    this.backgroundImage.setPosition(blockX, blockY);
    this.prevArrow.setPosition(blockX - 168 * this.scale, blockY);
    this.nextArrow.setPosition(blockX + 168 * this.scale, blockY);
    this.selectedFractionImage.setPosition(this.position.x, this.position.y);
  }

  protected updateVisibility(): void {
    this.backgroundImage.setVisible(this.visible);
    this.prevArrow.setVisible(this.visible);
    this.nextArrow.setVisible(this.visible);
    this.selectedFractionImage.setVisible(this.visible);
  }

  private nextFraction() {
    const currentIndex = fractionsStore.fractions.findIndex(
      ({ id }) => id === cabinetStore.selectedFraction,
    );

    let nextIndex = currentIndex + 1;
    if (currentIndex >= fractionsStore.fractions.length - 1) {
      nextIndex = 0;
    }

    cabinetStore.setSelectedFraction(fractionsStore.fractions[nextIndex].id);
  }

  private prevFraction() {
    const currentIndex = fractionsStore.fractions.findIndex(
      ({ id }) => id === cabinetStore.selectedFraction,
    );

    let prevIndex = currentIndex - 1;
    if (currentIndex <= 0) {
      prevIndex = fractionsStore.fractions.length - 1;
    }

    cabinetStore.setSelectedFraction(fractionsStore.fractions[prevIndex].id);
  }
}
