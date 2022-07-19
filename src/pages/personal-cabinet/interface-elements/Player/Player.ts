import { InterfaceElement } from '../../../../types/InterfaceElement';
import { Image } from '../Image/Image';

export class Player extends InterfaceElement {
  private _depth = 0;
  private _elementsScale = 1;
  private _lookElements: { [key: string]: Image } = {
    body: null,
    eyeSocketLeft: null,
    eyeSocketRight: null,
    eyeLeft: null,
    eyeRight: null,
    eyebrowLeft: null,
    eyebrowRight: null,
    mouth: null,
  };

  constructor(private readonly _scene: Phaser.Scene) {
    super();
  }

  public setElement(element: string, texture: string): Player {
    this._lookElements[element]?.destroy();
    this._lookElements[element] = new Image(this._scene, texture);
    this.update();
    return this;
  }

  public setSize(w: number, h: number): Player {
    this._elementsScale = Math.min(w, h) / 225;
    this.update();
    return this;
  }

  protected updateScale(): void {
    Object.values(this._lookElements).forEach((image) =>
      image?.setScale(this.scale * this._elementsScale),
    );
  }

  protected updatePosition(): void {
    const bodyX = this.position.x;
    const bodyY = this.position.y;

    const elementsTransform = {
      body: { position: { x: 0, y: 0 }, flip: false },
      eyeLeft: { position: { x: -40, y: -40 }, flip: false },
      eyeRight: { position: { x: 40, y: -40 }, flip: true },
      eyeSocketLeft: { position: { x: -40, y: -40 }, flip: false },
      eyeSocketRight: { position: { x: 40, y: -40 }, flip: true },
      eyebrowLeft: { position: { x: -50, y: -70 }, flip: false },
      eyebrowRight: { position: { x: 50, y: -70 }, flip: true },
      mouth: { position: { x: 0, y: 30 }, flip: false },
    };

    Object.entries(this._lookElements).forEach(([key, element], index) => {
      const transform = elementsTransform[key];
      if (!transform) return;

      element
        ?.setPosition(
          bodyX / this._elementsScale + transform.position.x,
          bodyY / this._elementsScale + transform.position.y,
        )
        .setFlip(transform.flip)
        .setDepth(this._depth + index);
    });
  }

  protected updateVisibility(): void {
    Object.values(this._lookElements).forEach((image) =>
      image?.setVisible(this.visible),
    );
  }

  public destroy(): void {
    Object.values(this._lookElements).forEach((image) => image?.destroy());
  }

  public setDepth(depth: number): Player {
    this._depth = depth;
    return this;
  }
}
