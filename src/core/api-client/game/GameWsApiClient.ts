import { io } from 'socket.io-client';
import { ApiClient } from '../ApiClient';
import { WsApiClient } from '../WsApiClient';

export class GameWsApiClient extends WsApiClient {
  protected static _socket = io(
    `ws://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/game`,
    {
      auth: { token: ApiClient.token },
    },
  );

  public static openSocket(): void {
    GameWsApiClient._socket = io(
      `ws://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/game`,
      {
        auth: { token: ApiClient.token },
      },
    );
  }

  public static closeSocket(): void {
    GameWsApiClient._socket = null;
  }
}
