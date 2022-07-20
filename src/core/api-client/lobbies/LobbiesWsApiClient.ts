import { io } from 'socket.io-client';
import { ApiClient } from '../ApiClient';
import { WsApiClient } from '../WsApiClient';

export class LobbiesWsApiClient extends WsApiClient {
  protected static readonly _socket = io(
    `ws://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/lobbies`,
    {
      auth: { token: ApiClient.token },
    },
  );
}
