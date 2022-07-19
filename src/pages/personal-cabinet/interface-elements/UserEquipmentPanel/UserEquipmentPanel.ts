import { autorun } from 'mobx';
import { InterfaceElement } from '../../../../types/InterfaceElement';
import { Image } from '../Image/Image';
import { ImageWithLabel } from '../Image/ImageWithLabel';
import { cabinetStore } from '../../../../core/mobx/CabinetStore';

export class UserEquipmentPanel extends InterfaceElement {
  private backgroundImage: Phaser.GameObjects.Image;
  private weapons = new Array<Image>();
  private clips = new Array<ImageWithLabel>();

  constructor(private readonly scene: Phaser.Scene) {
    super();

    this.backgroundImage = this.scene.add.image(0, 0, 'user-equipment-panel');

    autorun(() => {
      this.weapons.forEach((weapon) => weapon?.destroy());
      this.weapons = [];

      for (let i = 0; i < 3; i += 1) {
        const weapon = cabinetStore.equipment.get(i)?.[0];
        const texture = `weapon-${weapon?.id}`;

        if (!weapon) {
          this.weapons.push(undefined);
        } else {
          this.weapons.push(
            new Image(scene, texture)
              .setSize(110, 110)
              .on('pointerdown', () => {
                cabinetStore.removeWeapon(i);
              }),
          );
        }
      }

      this.update();
    });

    autorun(() => {
      this.clips.forEach((clip) => clip?.destroy());
      this.clips =
        cabinetStore.equipment.get(4)?.map(({ id, amount }) => {
          const texture = `clip-${id}`;
          return new ImageWithLabel(scene, texture, amount.toString(10))
            .setSize(50, 50)
            .on('pointerdown', () => {
              cabinetStore.removeClip({ id } as any);
            });
        }) ?? [];

      this.update();
    });
  }

  protected updateScale(): void {
    this.backgroundImage.setScale(this.scale);

    this.clips.forEach((image) => image?.setScale(this.scale));
    this.weapons.forEach((image) => image?.setScale(this.scale));
  }

  protected updatePosition(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.backgroundImage.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );

    this.weapons.forEach((image, index) => {
      image?.setPosition(this.position.x - 321 + 164 * index, this.position.y);
    });

    this.clips.forEach((image, index) => {
      image?.setPosition(
        this.position.x + 285 + (index % 2) * 60,
        this.position.y - 29 + Math.floor(index / 2) * 60,
      );
    });
  }

  protected updateVisibility(): void {
    this.backgroundImage.setVisible(this.visible);
    this.clips.forEach((image) => image?.setVisible(this.visible));
    this.weapons.forEach((image) => image?.setVisible(this.visible));
  }
}
