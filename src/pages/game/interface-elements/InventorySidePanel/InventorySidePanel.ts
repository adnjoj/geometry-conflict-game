import { InterfaceElement } from '../../../../types/InterfaceElement';
import { Image } from '../../../personal-cabinet/interface-elements/Image/Image';
import { Text } from '../../../personal-cabinet/interface-elements/Text/Text';

export class InventorySidePanel extends InterfaceElement {
  private _weapons = new Array<{
    data: { identifier: string; src: string };
    background: Image;
    itemImage: Image;
    label: Text;
  }>();
  private _clips = new Array<{
    data: { identifier: string; src: string; label: string };
    background: Image;
    itemImage: Image;
    label: Text;
  }>();
  private _selectedWeaponSlot = 0;

  constructor(private readonly _scene: Phaser.Scene) {
    super();
  }

  public setSelectedWeaponSlot(slot: number): void {
    this._selectedWeaponSlot = slot;
    this.updateSelectedWeapon();
  }

  public setWeapons(weapons: { identifier: string; src: string }[]): void {
    this._weapons.forEach(({ background, itemImage }) => {
      background.destroy();
      itemImage.destroy();
    });

    this._weapons = weapons
      .sort((a, b) => a.identifier.localeCompare(b.identifier))
      .map((data) => ({
        data,
        background: new Image(this._scene, 'inventory-side-panel-element-bg')
          .setSize(217, 65)
          .setDepth(999999),
        itemImage: new Image(this._scene, data.src)
          .setSize(184, 55)
          .setDepth(999999),
        label: null,
      }));

    this.update();
  }

  public setClips(
    clips: { identifier: string; src: string; label: string }[],
  ): void {
    this._clips.forEach(({ background, itemImage, label }) => {
      background.destroy();
      itemImage.destroy();
      label.destroy();
    });

    this._clips = clips
      .sort((a, b) => a.identifier.localeCompare(b.identifier))
      .map((data) => ({
        data,
        background: new Image(this._scene, 'inventory-side-panel-element-bg')
          .setSize(217, 65)
          .setDepth(999999),
        itemImage: new Image(this._scene, data.src)
          .setSize(45, 45)
          .setDepth(999999),
        label: new Text(this._scene, data.label)
          .setFont('Montserrat', 22)
          .setDepth(999999),
      }));

    this.updateSelectedWeapon();
    this.update();
  }

  protected updateSelectedWeapon(): void {
    this._weapons.forEach(({ data: { identifier }, background }) => {
      if (identifier.includes(this._selectedWeaponSlot.toString(10))) {
        return background.setTexture('inventory-side-panel-element-active-bg');
      }

      background.setTexture('inventory-side-panel-element-bg');
    });
  }

  protected updatePosition(): void {
    this._weapons.forEach(({ background, itemImage }, index) => {
      const positionX = this.position.x + 655;
      const positionY = this.position.y - 260 + index * 75;

      background.setPosition(positionX, positionY);
      itemImage.setPosition(positionX, positionY);
    });

    this._clips.forEach(({ background, itemImage, label }, index) => {
      const positionX = this.position.x + 655;
      const positionY =
        this.position.y - 260 + (index + this._weapons.length) * 75;

      background.setPosition(positionX, positionY);
      itemImage.setPosition(positionX - 60, positionY);
      label.setPosition(positionX - 5, positionY);
    });
  }

  protected updateScale(): void {
    this._weapons.forEach(({ background, itemImage }) => {
      background.setScale(this.scale);
      itemImage.setScale(this.scale);
    });

    this._clips.forEach(({ background, itemImage, label }) => {
      background.setScale(this.scale);
      itemImage.setScale(this.scale);
      label.setScale(this.scale);
    });
  }

  protected updateVisibility(): void {
    this._weapons.forEach(({ background, itemImage }) => {
      background.setVisible(this.visible);
      itemImage.setVisible(this.visible);
    });

    this._clips.forEach(({ background, itemImage, label }) => {
      background.setVisible(this.visible);
      itemImage.setVisible(this.visible);
      label.setVisible(this.visible);
    });
  }
}
