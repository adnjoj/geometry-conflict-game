import { InterfaceElement } from '../../../../../types/InterfaceElement';

import { Activity } from '../../../enums/Activity.enum';

import { cabinetStore } from '../../../../../core/mobx/CabinetStore';

export class ActivitiesMenu extends InterfaceElement {
  private skinsButton: Phaser.GameObjects.Image;
  private weaponsButton: Phaser.GameObjects.Image;
  private gamemodesButton: Phaser.GameObjects.Image;

  constructor(private readonly scene: Phaser.Scene) {
    super();

    this.skinsButton = this.scene.add.image(0, 0, 'skins-button');
    this.weaponsButton = this.scene.add.image(0, 0, 'weapons-button');
    this.gamemodesButton = this.scene.add.image(0, 0, 'gamemodes-button');

    this.skinsButton
      .setInteractive()
      .on('pointerdown', () => {
        cabinetStore.setSelectedTab('Skin');
        cabinetStore.setCurrentActivity(Activity.SKINS);
        this.skinsButton.setTexture('skins-button-pressed');
      })
      .on('pointerout', () => {
        this.skinsButton.setTexture('skins-button');
      })
      .on('pointerup', () => {
        this.skinsButton.setTexture('skins-button');
      });

    this.weaponsButton
      .setInteractive()
      .on('pointerdown', () => {
        cabinetStore.setSelectedTab('Weapon1');
        cabinetStore.setCurrentActivity(Activity.EQUIPMENT);
        this.weaponsButton.setTexture('weapons-button-pressed');
      })
      .on('pointerout', () => {
        this.weaponsButton.setTexture('weapons-button');
      })
      .on('pointerup', () => {
        this.weaponsButton.setTexture('weapons-button');
      });

    this.gamemodesButton
      .setInteractive()
      .on('pointerdown', () => {
        cabinetStore.setSelectedTab('Flag');
        cabinetStore.setCurrentActivity(Activity.GAMEMODES);
        this.gamemodesButton.setTexture('gamemodes-button-pressed');
      })
      .on('pointerout', () => {
        this.gamemodesButton.setTexture('gamemodes-button');
      })
      .on('pointerup', () => {
        this.gamemodesButton.setTexture('gamemodes-button');
      });
  }

  protected updateScale(): void {
    this.skinsButton.setScale(this.scale);
    this.weaponsButton.setScale(this.scale);
    this.gamemodesButton.setScale(this.scale);
  }

  protected updatePosition(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    const blockX = centerX + this.position.x * this.scale;
    const blockY = centerY + this.position.y * this.scale;

    this.skinsButton.setPosition(
      blockX - 101 * this.scale,
      blockY - 55 * this.scale,
    );
    this.weaponsButton.setPosition(
      blockX - 101 * this.scale,
      blockY + 55 * this.scale,
    );
    this.gamemodesButton.setPosition(
      blockX + 101 * this.scale,
      blockY + 55 * this.scale,
    );
  }

  protected updateVisibility(): void {
    this.skinsButton.setVisible(this.visible);
    this.weaponsButton.setVisible(this.visible);
    this.gamemodesButton.setVisible(this.visible);
  }
}
