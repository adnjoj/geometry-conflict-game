import type { Fraction } from './Fraction';
import type { SkinType } from './SkinType';

export interface Skin {
  id: number;
  name: string;
  type: SkinType;

  availableFractions: Fraction[];
}
