import type { Clip } from './Clip';
import type { Fraction } from './Fraction';
import type { Map } from './Map';
import type { Skin } from './Skin';
import type { Speciality } from './Speciality';
import type { Weapon } from './Weapon';

export interface User {
  id: number;
  username: string;
  fraction: Fraction;
  speciality: Speciality;
  map: Map;

  skins: { skin: Skin }[];
  clips: { amount: number; clip: Clip }[];
  weapons: { slot: number; weapon: Weapon }[];
}
