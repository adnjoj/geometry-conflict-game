import { autorun } from 'mobx';
import { _ } from 'svelte-i18n';
import { InterfaceElement } from '../../../../types/InterfaceElement';

import type { User } from '../../../../types/User';
import type { GameScene } from '../../scenes/Game';

import { Image } from '../../../personal-cabinet/interface-elements/Image/Image';
import { Player } from '../../../personal-cabinet/interface-elements/Player/Player';

import { skinTypesStore } from '../../../../core/mobx/SkinTypesStore';
import { Text } from '../../../personal-cabinet/interface-elements/Text/Text';
import { get } from 'svelte/store';

export class GameOverScreen extends InterfaceElement {
  private _backgroundImage: Image;
  private _winnerFractionText: Text;
  private _players = new Array<{
    data: User;
    image: Player;
    usernameText: Text;
    statistics: {
      specialityText: Text;
      killsText: Text;
      damageDealtText: Text;
      damageTakenText: Text;
    };
  }>();

  constructor(private readonly _scene: GameScene) {
    super();
    this._backgroundImage = new Image(_scene, 'game-over-bg')
      .setSize(1920 / 1.2, 1080 / 1.2)
      .setDepth(10000000);

    this._winnerFractionText = new Text(_scene, '');

    autorun(() => this.updateTextures());
  }

  public setWinnerFraction(winnerFraction: string): void {
    this._winnerFractionText.destroy();
    this._winnerFractionText = new Text(
      this._scene,
      get(_)(`winnerFractionCongratulations.${winnerFraction}`),
    )
      .setFont('Montserrat', 48)
      .setDepth(10000000)
      .setOrigin(0, 0.5);
  }

  public setPlayers(
    players: Array<
      User & {
        statistics: { kills: number; damageDealt: number; damageTaken: number };
      }
    >,
  ): void {
    this._players.forEach(({ image }) => image.destroy());

    this._players = players.map((data) => {
      const player = {
        data,
        image: new Player(this._scene).setSize(160, 160).setDepth(10000000),
        usernameText: new Text(this._scene, data.username),
        statistics: {
          specialityText: new Text(
            this._scene,
            get(_)(`specialities.${data.speciality.name}`),
          ),

          killsText: new Text(this._scene, data.statistics.kills.toString(10)),

          damageDealtText: new Text(
            this._scene,
            data.statistics.damageDealt.toString(10),
          ),

          damageTakenText: new Text(
            this._scene,
            data.statistics.damageTaken.toString(10),
          ),
        },
      };

      [
        player.usernameText,
        player.statistics.specialityText,
        player.statistics.killsText,
        player.statistics.damageDealtText,
        player.statistics.damageTakenText,
      ].forEach((textObject) =>
        textObject
          .setFont('Montserrat', 32)
          .setDepth(10000000)
          .setOrigin(0.5, 0.5),
      );

      return player;
    });

    this.updateTextures();
  }

  protected updateTextures(): void {
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
      this._players.forEach(({ data, image }) => {
        const skinId = data.skins.find(({ skin }) => skin?.type?.id === id)
          ?.skin.id;
        image.setElement(key, `skins/${skinId}/skinImage.png`);
      });
    });

    this.update();
  }

  protected updateScale(): void {
    this._backgroundImage.setScale(this.scale);
    this._winnerFractionText.setScale(this.scale);
    this._players.forEach(({ image, usernameText, statistics }) => {
      image.setScale(this.scale);
      usernameText.setScale(this.scale);

      Object.values(statistics).forEach((text) => text.setScale(this.scale));
    });
  }

  protected updatePosition(): void {
    this._backgroundImage.setPosition(this.position.x, this.position.y);
    this._winnerFractionText.setPosition(
      this.position.x - 680,
      this.position.y - 375,
    );

    this._players.forEach(({ image, usernameText, statistics }, index) => {
      image.setPosition(
        this.position.x - 495 + index * 255,
        this.position.y - 150,
      );

      usernameText.setPosition(
        this.position.x - 495 + index * 255,
        this.position.y - 260,
      );

      Object.values(statistics).forEach((text, statisticsItemIndex) => {
        text.setPosition(
          this.position.x - 495 + index * 255,
          this.position.y - 8 + 92 * statisticsItemIndex,
        );
      });
    });
  }

  protected updateVisibility(): void {
    this._backgroundImage.setVisible(this.visible);
    this._winnerFractionText.setVisible(this.visible);
    this._players.forEach(({ image, usernameText, statistics }) => {
      image.setVisible(this.visible);
      usernameText.setVisible(this.visible);

      Object.values(statistics).forEach((text) =>
        text.setVisible(this.visible),
      );
    });
  }
}
