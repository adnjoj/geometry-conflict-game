import { ApiClient } from '../ApiClient';

export class WeaponsApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/weapons`);
  }
}
