export abstract class InterfaceElement {
  public scale = 1;
  public visible = true;
  public position = { x: 0, y: 0 };

  protected abstract updateScale(): void;

  protected abstract updatePosition(): void;

  protected abstract updateVisibility(): void;

  update() {
    this.updateScale();
    this.updatePosition();
    this.updateVisibility();
  }

  setPosition(x: number, y: number) {
    this.position = { x, y };
    this.updatePosition();
    return this;
  }

  setScale(value: number) {
    this.scale = value;
    this.updateScale();
    this.updatePosition();
    return this;
  }

  setVisible(value: boolean) {
    this.visible = value;
    this.updateVisibility();
    return this;
  }
}
