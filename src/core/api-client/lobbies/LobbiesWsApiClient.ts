import { io } from 'socket.io-client';
import { ApiClient } from '../ApiClient';
import { WsApiClient } from '../WsApiClient';

export class LobbiesWsApiClient extends WsApiClient {
  protected static readonly _socket = io(
    `ws://${process.env.SERVER_HOSTNAME}:3001/lobbies`,
    {
      auth: { token: ApiClient.token },
    },
  );
}
