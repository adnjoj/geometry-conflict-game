import { ApiClient } from '../ApiClient';

export class GamemodesApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/gamemodes`);
  }
}
