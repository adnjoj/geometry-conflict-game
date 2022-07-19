import type { Clip } from './Clip';
import type { Speciality } from './Speciality';
import type { WeaponType } from './WeaponType';

export interface Weapon {
  id: number;
  name: string;
  damage: number;
  spread: number;
  rateOfFire: number;
  reloadSpeed: number;
  firingRange: number;
  weight: number;

  type: WeaponType;
  clip: Clip;

  availableSpecialities: Speciality[];
}
