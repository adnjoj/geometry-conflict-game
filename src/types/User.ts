import type { Clip } from './Clip';
import type { Fraction } from './Fraction';
import type { Map } from './Map';
import type { Skin } from './Skin';
import type { Speciality } from './Speciality';
import type { Weapon } from './Weapon';

export interface User {
  id: number;
  username: string;
  __fraction__: Fraction;
  __speciality__: Speciality;
  __map__: Map;

  __skins__: { skin: Skin }[];
  __clips__: { amount: number; clip: Clip }[];
  __weapons__: { slot: number; weapon: Weapon }[];
}
