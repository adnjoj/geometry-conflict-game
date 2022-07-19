import { ApiClient } from '../ApiClient';

export class ClipsApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/clips`);
  }
}
