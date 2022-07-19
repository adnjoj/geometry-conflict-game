import type { Gamemode } from './Gamemode';

export interface Map {
  id: number;
  name: string;
  width: number;
  height: number;

  gamemode: Gamemode;
}
