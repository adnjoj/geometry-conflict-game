export abstract class GameObject {
  protected _position = { x: 0, y: 0 };
  protected _scale = 1;

  private _distanceLeft = { x: 0, y: 0 };
  private _timeOfArrivalAtTheTargetPosition = 0;
  private _previousMotionTime = 0;

  protected abstract updatePosition(): void;

  protected abstract updateScale(): void;

  public move(x: number, y: number): void {
    this._position.x += x;
    this._position.y += y;
    this.updatePosition();
  }

  public setScale(scale: number): void {
    this._scale = scale;
    this.updateScale();
  }

  public abstract setDepth(depth: number): void;

  public moveToByTime(time: number, x: number, y: number): void {
    this._timeOfArrivalAtTheTargetPosition = time;
    this._distanceLeft = {
      x: x - this._position.x,
      y: y - this._position.y,
    };

    this._previousMotionTime = Date.now();
  }

  public update(): void {
    const currentTime = Date.now();
    const deltaTime = currentTime - this._previousMotionTime;
    const fullPathTime = Math.max(
      0.0001,
      this._timeOfArrivalAtTheTargetPosition - this._previousMotionTime,
    );

    const pathPart = Math.min(deltaTime / fullPathTime, 1);

    const motionX = this._distanceLeft.x * pathPart;
    const motionY = this._distanceLeft.y * pathPart;

    this._distanceLeft.x -= motionX;
    this._distanceLeft.y -= motionY;

    this.move(motionX, motionY);

    this._previousMotionTime = currentTime;
  }

  public abstract destroy(): void;
}
