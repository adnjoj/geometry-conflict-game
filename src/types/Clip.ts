import type { Speciality } from './Speciality';

export interface Clip {
  id: number;
  name: string;
  bulletsAmount: number;
  weight: number;
  availableSpecialities: Speciality[];
}
