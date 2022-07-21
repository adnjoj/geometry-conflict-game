import { autorun } from 'mobx';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

import { InterfaceElement } from '../../../../../types/InterfaceElement';
import { Image } from '../../Common/Image/Image';

import { specialitiesStore } from '../../../../../core/mobx/SpecialitiesStore';
import { cabinetStore } from '../../../../../core/mobx/CabinetStore';

export class SpecialityScreen extends InterfaceElement {
  private backgroundImage: Phaser.GameObjects.Image;
  private prevArrow: Phaser.GameObjects.Image;
  private nextArrow: Phaser.GameObjects.Image;
  private selectedSpecialityImage: Image;

  private selectedSpecialityText: Phaser.GameObjects.Text;

  constructor(private readonly scene: Phaser.Scene) {
    super();

    this.backgroundImage = this.scene.add.image(0, 0, 'speciality-screen-bg');
    this.prevArrow = this.scene.add.image(0, 0, 'arrow');
    this.nextArrow = this.scene.add.image(0, 0, 'arrow');
    this.selectedSpecialityImage = new Image(scene, 'empty').setSize(70, 70);

    this.selectedSpecialityText = this.scene.add
      .text(0, 0, '')
      .setOrigin(0, 0.5)
      .setFontFamily('Montserrat')
      .setFontSize(24);

    this.nextArrow.setFlipX(true);

    this.nextArrow
      .setInteractive()
      .on('pointerdown', this.nextSpeciality.bind(this));
    this.prevArrow
      .setInteractive()
      .on('pointerdown', this.prevSpeciality.bind(this));

    autorun(() => {
      const search = ({ id }) => id === cabinetStore.selectedSpeciality;
      const specialityName =
        specialitiesStore.specialities.find(search)?.name ?? '';

      this.selectedSpecialityText.setText(
        get(_)(`specialities.${specialityName}`),
      );
      this.selectedSpecialityImage.setTexture(`speciality-${specialityName}`);
    });
  }

  protected updateScale(): void {
    this.backgroundImage.setScale(this.scale);
    this.prevArrow.setScale(this.scale);
    this.nextArrow.setScale(this.scale);
    this.selectedSpecialityText.setScale(this.scale);
    this.selectedSpecialityImage.setScale(this.scale);
  }

  protected updatePosition(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    const blockX = centerX + this.position.x * this.scale;
    const blockY = centerY + this.position.y * this.scale;

    this.backgroundImage.setPosition(blockX, blockY);
    this.prevArrow.setPosition(blockX - 168 * this.scale, blockY);
    this.nextArrow.setPosition(blockX + 168 * this.scale, blockY);
    this.selectedSpecialityText.setPosition(blockX - 45 * this.scale, blockY);
    this.selectedSpecialityImage.setPosition(
      this.position.x - 95,
      this.position.y,
    );
  }

  protected updateVisibility(): void {
    this.backgroundImage.setVisible(this.visible);
    this.prevArrow.setVisible(this.visible);
    this.nextArrow.setVisible(this.visible);
    this.selectedSpecialityText.setVisible(this.visible);
    this.selectedSpecialityImage.setVisible(this.visible);
  }

  private nextSpeciality() {
    const currentIndex = specialitiesStore.specialities.findIndex(
      ({ id }) => id === cabinetStore.selectedSpeciality,
    );

    let nextIndex = currentIndex + 1;
    if (currentIndex >= specialitiesStore.specialities.length - 1) {
      nextIndex = 0;
    }

    cabinetStore.setSelectedSpeciality(
      specialitiesStore.specialities[nextIndex].id,
    );
  }

  private prevSpeciality() {
    const currentIndex = specialitiesStore.specialities.findIndex(
      ({ id }) => id === cabinetStore.selectedSpeciality,
    );

    let prevIndex = currentIndex - 1;
    if (currentIndex <= 0) {
      prevIndex = specialitiesStore.specialities.length - 1;
    }

    cabinetStore.setSelectedSpeciality(
      specialitiesStore.specialities[prevIndex].id,
    );
  }
}
