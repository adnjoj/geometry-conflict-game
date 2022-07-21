import type { GameScene } from '../../../scenes/Game';

import { GameWsApiClient } from '../../../../../core/api-client/game/GameWsApiClient';
import { InterfaceElement } from '../../../../../types/InterfaceElement';
import { Image } from '../../Common/Image/Image';
import { Text } from '../../Common/Text/Text';

export class InteractionMenu extends InterfaceElement {
  private _options = new Array<{
    id: number;
    background: Image;
    label: Text;
  }>();
  private _selectedItemIndex = 0;

  // When player takes weapon from the ground he throws his own weapon and
  // then takes another one. Because of that a frame appears for a short
  // time whene there are available 1 more interaction
  // This timer is required to avoid it
  private _updateTimeout: NodeJS.Timeout;

  constructor(private readonly _scene: GameScene) {
    super();

    _scene.input.on('wheel', (_pointer, _gameObjects, _deltaX, deltaY) => {
      if (deltaY > 0) this._selectedItemIndex += 1;
      if (deltaY < 0) this._selectedItemIndex -= 1;

      this.clampSelectedOptionIndex();
      this.updateSelectedOptionTexture();
    });

    _scene.input.keyboard.addKey('E').on('down', () => {
      const objectId = this._options[this._selectedItemIndex]?.id;
      if (!objectId) return;
      if (_scene.interfaceElements.get('inventory')?.visible) return;
      GameWsApiClient.emit('interaction', { objectId });
    });
  }

  public setOptions(options: { id: number; name: string }[]): void {
    clearTimeout(this._updateTimeout);

    this._updateTimeout = setTimeout(() => {
      this._options.forEach(({ background, label }) => {
        background.destroy();
        label.destroy();
      });

      this._options = options.map(({ id, name }, index) => ({
        id,
        background: new Image(this._scene, 'interaction-menu-option-bg')
          .setSize(200, 40)
          .setDepth(999999)
          .on('pointerover', () => {
            this._selectedItemIndex = index;
            this.updateSelectedOptionTexture();
          }),

        label: new Text(this._scene, name)
          .setFont('Montserrat', 22)
          .cutByMaxLength(10)
          .setDepth(999999)
          .on('pointerover', () => {
            this._selectedItemIndex = index;
            this.updateSelectedOptionTexture();
          }),
      }));

      this.clampSelectedOptionIndex();
      this.updateSelectedOptionTexture();

      this.update();
    }, 40);
  }

  private clampSelectedOptionIndex(): void {
    this._selectedItemIndex = Math.min(
      Math.max(this._selectedItemIndex, 0),
      this._options.length - 1,
    );
  }

  private updateSelectedOptionTexture(): void {
    this._options.forEach(({ background }, index) => {
      if (index === this._selectedItemIndex) {
        background.setTexture('interaction-menu-option-active-bg');
      } else {
        background.setTexture('interaction-menu-option-bg');
      }
    });
  }

  protected updatePosition(): void {
    const totalHeight = (this._options.length - 1) * 55;

    this._options.forEach(({ background, label }, index) => {
      background.setPosition(
        this.position.x + 170,
        this.position.y - totalHeight / 2 + index * 55,
      );

      label.setPosition(
        this.position.x + 80,
        this.position.y - totalHeight / 2 + index * 55,
      );
    });
  }

  protected updateScale(): void {
    this._options.forEach(({ background, label }) => {
      background.setScale(this.scale);
      label.setScale(this.scale);
    });
  }

  protected updateVisibility(): void {
    this._options.forEach(({ background, label }) => {
      background.setVisible(this.visible);
      label.setVisible(this.visible);
    });
  }
}
