import { ApiClient } from '../ApiClient';

export class WeaponTypesApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/weapon-types`);
  }
}
