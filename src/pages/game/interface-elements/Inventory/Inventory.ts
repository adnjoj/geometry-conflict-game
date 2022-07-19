import { GameWsApiClient } from '../../../../core/api-client/game/GameWsApiClient';
import { InterfaceElement } from '../../../../types/InterfaceElement';
import { Image } from '../../../personal-cabinet/interface-elements/Image/Image';

export class Inventory extends InterfaceElement {
  private _background: Image;
  private _items: Image[] = [];
  private _hoveredItemIdentifier: string;

  constructor(private readonly _scene: Phaser.Scene) {
    super();
    this._background = new Image(_scene, 'inventory-bg')
      .setSize(1143, 450)
      .setDepth(1000000);

    _scene.input.keyboard.addKey('Q').on('down', () => {
      if (!this._hoveredItemIdentifier) return;

      const identifier = this._hoveredItemIdentifier;
      GameWsApiClient.emit('drop_inventory_item', { identifier });
    });
  }

  public setItems(items: { identifier: string; src: string }[]): void {
    this._items.forEach((item) => item.destroy());

    this._items = items.map((item) =>
      new Image(this._scene, item.src)
        .setSize(80, 80)
        .setDepth(1000000)
        .on('pointerover', () => {
          this._hoveredItemIdentifier = item.identifier;
        })
        .on('pointerout', () => {
          this._hoveredItemIdentifier = undefined;
        }),
    );

    this.update();
  }

  protected updatePosition(): void {
    this._background.setPosition(this.position.x, this.position.y);

    this._items.forEach((item, index) => {
      item.setPosition(
        this.position.x - 488 + (index % 8) * 140,
        this.position.y - 148 + Math.floor(index / 8) * 150,
      );
    });
  }

  protected updateScale(): void {
    this._background.setScale(this.scale);
    this._items.forEach((item) => item.setScale(this.scale));
  }

  protected updateVisibility(): void {
    this._background.setVisible(this.visible);
    this._items.forEach((item) => item.setVisible(this.visible));
  }
}
