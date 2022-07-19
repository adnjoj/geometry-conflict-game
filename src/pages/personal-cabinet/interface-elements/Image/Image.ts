import { InterfaceElement } from '../../../../types/InterfaceElement';

export class Image extends InterfaceElement {
  protected _image: Phaser.GameObjects.Image;

  protected _size = { w: 0, h: 0 };

  constructor(
    protected readonly _scene: Phaser.Scene,
    protected _texture: string,
  ) {
    super();

    if (_scene.textures.exists(_texture)) {
      this._image = _scene.add.image(0, 0, _texture).setInteractive();
    } else {
      this._image = _scene.add.image(0, 0, 'empty');
    }

    _scene.load.on(Phaser.Loader.Events.COMPLETE, () => {
      this._image.scene = _scene;
      this.setTexture(this.texture);
      this.update();
    });
  }

  public get size(): { w: number; h: number } {
    if (this._size.w === 0 && this._size.h === 0) {
      return { w: this._image.width, h: this._image.height };
    }

    return this._size;
  }

  on(event: string, handler: () => void) {
    this._image.on(event, handler);
    return this;
  }

  protected updateScale() {
    const ownScale = Math.min(
      this.size.w / this._image.width,
      this.size.h / this._image.height,
    );

    this._image.setScale(this.scale * ownScale);
  }

  protected updatePosition() {
    const centerX = this._scene.scale.width / 2;
    const centerY = this._scene.scale.height / 2;

    this._image.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );
  }

  protected updateVisibility() {
    this._image.setVisible(this.visible);
  }

  public get texture(): string {
    return this._texture;
  }

  setTexture(texture: string) {
    this._texture = texture;

    if (this._scene.textures.exists(texture)) {
      this._image.setTexture(texture).setInteractive();
    } else {
      this._image.setTexture('empty');
    }

    this.update();
  }

  setAngle(angle: number) {
    this._image.setAngle(angle);
    return this;
  }

  setSize(w: number, h: number) {
    this._size = { w, h };
    this.update();
    return this;
  }

  public get depth(): number {
    return this._image.depth;
  }

  setDepth(depth: number) {
    this._image.setDepth(depth);
    this.update();
    return this;
  }

  setFlip(flip: boolean) {
    this._image.setFlipX(flip);
    this.update();
    return this;
  }

  destroy() {
    this._image.destroy();
    return this;
  }
}
