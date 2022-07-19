import { ApiClient } from '../ApiClient';

export class GameObjectsApiClient extends ApiClient {
  static async getAll() {
    return this.get(`${this.SERVER_HOST}/game-objects`);
  }

  static async create(data: any) {
    return this.postJson(`${this.SERVER_HOST}/game-objects`, data);
  }

  static async update(id: number, data: any) {
    return this.patchJson(`${this.SERVER_HOST}/game-objects/${id}`, data);
  }

  static async uploadFiles(id: number, files: FormData) {
    return this.postFormData(
      `${this.SERVER_HOST}/game-objects/${id}/files`,
      files,
    );
  }

  static async remove(id: number) {
    return this.delete(`${this.SERVER_HOST}/game-objects/${id}`);
  }
}
