import { action, makeAutoObservable } from 'mobx';

import type { Lobby } from '../../types/Lobby';

import { LobbiesWsApiClient } from '../api-client/lobbies/LobbiesWsApiClient';

export class LobbiesStore {
  lobbies = new Map<number, Lobby>();

  constructor() {
    makeAutoObservable(this);

    LobbiesWsApiClient.on(
      'available_lobbies',
      action((lobbies: any[]) => {
        this.lobbies = new Map();

        lobbies.forEach(({ lobby, time }) => {
          this.lobbies.set(lobby.id, { ...lobby, updateTime: time });
        });
      }),
    );

    LobbiesWsApiClient.on(
      'lobby_created',
      action((data: any) => {
        this.lobbies.set(data.lobby.id, {
          ...data.lobby,
          updateTime: data.time,
        });
      }),
    );

    LobbiesWsApiClient.on(
      'lobby_updated',
      action((data: any) => {
        if (data.time > this.lobbies.get(data.lobby.id)?.updateTime) {
          this.lobbies.set(data.lobby.id, {
            ...data.lobby,
            updateTime: data.time,
          });
        }
      }),
    );
  }

  requestLobbies() {
    LobbiesWsApiClient.emit('get_lobbies');
  }
}

export const lobbiesStore = new LobbiesStore();
