import { autorun } from 'mobx';
import { InterfaceElement } from '../../../../../types/InterfaceElement';
import { Player } from '../../Common/Player/Player';

import { cabinetStore } from '../../../../../core/mobx/CabinetStore';
import { skinTypesStore } from '../../../../../core/mobx/SkinTypesStore';

export class CharacterScreen extends InterfaceElement {
  private _backgroundImage: Phaser.GameObjects.Image;
  private _player: Player;

  constructor(private readonly _scene: Phaser.Scene) {
    super();
    this._backgroundImage = _scene.add.image(0, 0, 'character-screen-bg');
    this._player = new Player(_scene).setSize(220, 220);

    autorun(() => {
      const lookElementTypes = {
        body: skinTypesStore.elementsEnum.Skin?.id,
        mouth: skinTypesStore.elementsEnum.Mouth?.id,
        eyeLeft: skinTypesStore.elementsEnum.Eyes?.id,
        eyeRight: skinTypesStore.elementsEnum.Eyes?.id,
        eyebrowLeft: skinTypesStore.elementsEnum.Eyebrows?.id,
        eyebrowRight: skinTypesStore.elementsEnum.Eyebrows?.id,
        eyeSocketLeft: skinTypesStore.elementsEnum.Eyesockets?.id,
        eyeSocketRight: skinTypesStore.elementsEnum.Eyesockets?.id,
      };

      Object.entries(lookElementTypes).forEach(([key, id]) => {
        const skinId = cabinetStore.lookElements.get(id)?.id;
        this._player.setElement(key, `skin-${skinId}`);
      });

      this.update();
    });
  }

  protected updateScale(): void {
    this._backgroundImage.setScale(this.scale);
    this._player.setScale(this.scale);
  }

  protected updatePosition(): void {
    const centerX = this._scene.scale.width / 2;
    const centerY = this._scene.scale.height / 2;

    this._backgroundImage.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );

    const bodyX = this.position.x + 200;
    const bodyY = this.position.y;

    this._player.setPosition(bodyX, bodyY);
  }

  protected updateVisibility(): void {
    this._backgroundImage.setVisible(this.visible);
    this._player.setVisible(this.visible);
  }
}
