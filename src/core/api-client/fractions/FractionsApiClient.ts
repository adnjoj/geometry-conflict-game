import { ApiClient } from '../ApiClient';

export class FractionsApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/fractions`);
  }
}
