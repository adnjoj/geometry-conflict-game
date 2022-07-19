import { ApiClient } from '../ApiClient';

export class SpecialitiesApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/specialities`);
  }
}
