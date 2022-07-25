import type { GameScene } from '../../pages/index/scenes/Game';
import type { DataToRender } from './types/DataToRender';
import type { DataToRenderImage } from './types/DataToRenderImage';
import type { DataToRenderText } from './types/DataToRenderText';

import { Image } from '../../pages/index/game-objects/Image';
import { Text } from '../../pages/index/game-objects/Text';

export class GameObjectGateway {
  public playerId;

  private readonly _smoothnessDelay = 40;

  constructor(private readonly _scene: GameScene) {}

  handleCreated(data: {
    id: number;
    dataToRender: DataToRender;
    time: number;
  }): void {
    const { id, dataToRender } = data;
    if (!id || !dataToRender) return;

    if ('src' in dataToRender) {
      const { x, y, z, flip, angle, src } = dataToRender as DataToRenderImage;
      const imageObject = new Image(this._scene, src, x, y);

      imageObject.setDepth(z);
      imageObject.setFlip(flip);
      imageObject.setAngle(angle);

      if (id === this.playerId) {
        this._scene.cameras.main.startFollow(imageObject.image);
      }

      this._scene.gameObjects.set(id, imageObject);
    } else if ('text' in dataToRender) {
      const { x, y, z, flip, angle, text, fontFamily, fontSize } =
        dataToRender as DataToRenderText;
      const textObject = new Text(this._scene, text, x, y);

      textObject.setDepth(z);
      textObject.setFlip(flip);
      textObject.setAngle(angle);
      textObject.setFontFamily(fontFamily);
      textObject.setFontSize(fontSize);

      if (id === this.playerId) {
        this._scene.cameras.main.startFollow(textObject.text);
      }

      this._scene.gameObjects.set(id, textObject);
    }

    this._scene.updateInterfaceElementsScale();
  }

  handleUpdated(data: {
    updatedGameObjects: { id: number; renderData: DataToRender }[];
    time: number;
  }): void {
    if (!data.time || !data.updatedGameObjects) return;

    const gameObjectsAnimationEndTime = Date.now() + this._smoothnessDelay;

    data.updatedGameObjects.forEach(({ id, renderData }) => {
      if (!id || !renderData) return;

      const gameObject = this._scene.gameObjects.get(id);
      if (!gameObject) return;

      gameObject.moveToByTime(
        gameObjectsAnimationEndTime,
        renderData.x,
        renderData.y,
      );

      gameObject.setDepth(renderData.z);

      if (gameObject instanceof Image && 'src' in renderData) {
        gameObject.setTexture(renderData.src);
        gameObject.setFlip(renderData.flip);
        gameObject.setAngle(renderData.angle);
      } else if (gameObject instanceof Text && 'text' in renderData) {
        gameObject.setText(renderData.text);
        gameObject.setFlip(renderData.flip);
        gameObject.setAngle(renderData.angle);
        gameObject.setFontFamily(renderData.fontFamily);
        gameObject.setFontSize(renderData.fontSize);
      }
    });
  }

  handleDestroyed(data: { id: number; time: number }): void {
    setTimeout(() => {
      const { id } = data;
      if (!id) return;

      this._scene.gameObjects.get(id)?.destroy();
      this._scene.gameObjects.delete(id);
    }, this._smoothnessDelay);
  }
}
