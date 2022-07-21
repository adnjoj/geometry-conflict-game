import { InterfaceElement } from '../../../../../types/InterfaceElement';
import { lobbiesStore } from '../../../../../core/mobx/LobbiesStore';
import type { PersonalCabinetScene } from '../../../scenes/PersonalCabinet';

export class StartButton extends InterfaceElement {
  private lobbiesMenuVisible = false;

  private button: Phaser.GameObjects.Image;

  constructor(private readonly scene: PersonalCabinetScene) {
    super();

    this.button = this.scene.add.image(0, 0, 'start-button');

    this.button
      .setInteractive()
      .on('pointerdown', () => {
        this.lobbiesMenuVisible = !this.lobbiesMenuVisible;

        scene.setLobbiesMenuVisible(this.lobbiesMenuVisible);
        lobbiesStore.requestLobbies();

        this.button.setTexture('start-button-pressed');
      })
      .on('pointerout', () => {
        this.button.setTexture('start-button');
      })
      .on('pointerup', () => {
        this.button.setTexture('start-button');
      });
  }

  protected updateScale(): void {
    this.button.setScale(this.scale);
  }

  protected updatePosition(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.button.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );
  }

  protected updateVisibility(): void {
    this.button.setVisible(this.visible);
  }
}
