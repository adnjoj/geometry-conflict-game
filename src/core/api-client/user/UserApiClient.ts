import { ApiClient } from '../ApiClient';

export class UserApiClient extends ApiClient {
  static getLogged() {
    return this.get(`${this.SERVER_HOST}/users/me`);
  }

  static setFraction(data: any) {
    return this.postJson(`${this.SERVER_HOST}/users/me/fraction`, data);
  }

  static setSpeciality(data: any) {
    return this.postJson(`${this.SERVER_HOST}/users/me/speciality`, data);
  }

  static setSkin(data: any) {
    return this.postJson(`${this.SERVER_HOST}/users/me/skins`, data);
  }

  static setWeapon(data: any) {
    return this.postJson(`${this.SERVER_HOST}/users/me/weapons`, data);
  }

  static removeWeapon(data: any) {
    return this.delete(`${this.SERVER_HOST}/users/me/weapons`, data);
  }

  static addClip(data: any) {
    return this.postJson(`${this.SERVER_HOST}/users/me/clips`, data);
  }

  static removeClip(data: any) {
    return this.delete(`${this.SERVER_HOST}/users/me/clips`, data);
  }

  static setMap(data: any) {
    return this.postJson(`${this.SERVER_HOST}/users/me/map`, data);
  }
}
