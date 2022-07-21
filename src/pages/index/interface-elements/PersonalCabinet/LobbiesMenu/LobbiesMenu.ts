import { autorun } from 'mobx';
import type { PersonalCabinetScene } from '../../../scenes/PersonalCabinet';

import { InterfaceElement } from '../../../../../types/InterfaceElement';

import { LobbiesWsApiClient } from '../../../../../core/api-client/lobbies/LobbiesWsApiClient';

import { lobbiesStore } from '../../../../../core/mobx/LobbiesStore';

export class LobbiesMenu extends InterfaceElement {
  private waitingForResponseFromLobbyId: number = undefined;

  private backgroundImage: Phaser.GameObjects.Image;
  private selectLobbyText: Phaser.GameObjects.Text;
  private lobbies = new Array<Phaser.GameObjects.Text>();

  constructor(private readonly scene: PersonalCabinetScene) {
    super();
    this.backgroundImage = this.scene.add.image(0, 0, 'character-screen-bg');
    this.selectLobbyText = this.scene.add
      .text(0, 0, 'Выберите лобби:')
      .setOrigin(0, 0.5)
      .setFontFamily('Montserrat')
      .setFontSize(24);

    LobbiesWsApiClient.on('failed_to_join_lobby', ({ lobbyId, reason }) => {
      if (reason) alert(reason);

      if (lobbyId === this.waitingForResponseFromLobbyId) {
        this.waitingForResponseFromLobbyId = undefined;
      }
    });

    LobbiesWsApiClient.on('successfully_joined_lobby', ({ token }) => {
      localStorage.lobbyToken = `Bearer ${token}`;
      scene.startGame();
    });

    autorun(() => {
      this.lobbies.forEach((lobby) => lobby.destroy());

      this.lobbies = Array.from(lobbiesStore.lobbies.values())
        .sort((a, b) => a.id - b.id)
        .map(({ id, playersCount, maxPlayersCount }) => {
          return scene.add
            .text(0, 0, `${playersCount}/${maxPlayersCount}`)
            .setOrigin(0, 0.5)
            .setFontFamily('Montserrat')
            .setFontSize(24)
            .setInteractive()
            .on('pointerdown', () => {
              if (this.waitingForResponseFromLobbyId !== undefined) return;

              this.waitingForResponseFromLobbyId = id;
              LobbiesWsApiClient.emit('join_lobby', { lobbyId: id });
            });
        });

      if (this.lobbies.length === 0) {
        this.lobbies.push(
          scene.add
            .text(0, 0, 'Выберите карту')
            .setOrigin(0, 0.5)
            .setFontFamily('Montserrat')
            .setFontSize(24),
        );
      }

      this.update();
    });
  }

  protected updateScale(): void {
    this.backgroundImage.setScale(this.scale);
    this.selectLobbyText.setScale(this.scale);
    this.lobbies.forEach((lobby) => lobby.setScale(this.scale));
  }

  protected updatePosition(): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    this.backgroundImage.setPosition(
      centerX + this.position.x * this.scale,
      centerY + this.position.y * this.scale,
    );

    this.selectLobbyText.setPosition(
      centerX + (this.position.x - 360) * this.scale,
      centerY + (this.position.y - 120) * this.scale,
    );

    this.lobbies.forEach((lobby, i) =>
      lobby.setPosition(
        centerX + (this.position.x - 330 + (i % 4) * 200) * this.scale,
        centerY + (this.position.y - 65 + Math.floor(i / 4) * 70) * this.scale,
      ),
    );
  }

  protected updateVisibility(): void {
    this.backgroundImage.setVisible(this.visible);
    this.selectLobbyText.setVisible(this.visible);
    this.lobbies.forEach((lobby) => lobby.setVisible(this.visible));
  }
}
