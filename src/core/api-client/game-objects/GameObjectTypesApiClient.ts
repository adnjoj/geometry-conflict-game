import { ApiClient } from '../ApiClient';

export class GameObjectTypesApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/game-object-types`);
  }
}
