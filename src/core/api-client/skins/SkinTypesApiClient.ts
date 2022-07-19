import { ApiClient } from '../ApiClient';

export class SkinTypesApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/skin-types`);
  }
}
