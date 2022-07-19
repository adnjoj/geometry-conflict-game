export interface DataToRenderText {
  text: string;
  fontFamily: string;
  fontSize: number;

  x: number;
  y: number;
  z: number;
  angle: number;
  flip: { x: boolean; y: boolean };
}
