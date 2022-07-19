import type { Socket } from 'socket.io-client';

export class WsApiClient {
  protected static readonly _socket: Socket;

  static on(event: string, handler: (data: any) => any) {
    this._socket?.removeAllListeners(event);
    this._socket?.on(event, handler);
  }

  static emit(event: string, data?: any) {
    this._socket?.emit(event, data);
  }
}
