import { IValue } from '../Value';
import { IOrdinal } from '../Ordinal';
import { ITranslatable } from '../Translatable';
import { Pair } from '../util/Pair';
import { Triple } from '../util/Triple';
import { IVector, Vector2D, Vector3D } from '../Vector';

export interface IPosition extends IOrdinal {
  /**
   * construct a new Position from the maximum elements of each component
   */
  maximum(right: IPosition): IPosition;
  /**
   * construct a new Position from the miminum elements of each component
   */
  minimum(right: IPosition): IPosition;
  /**
   * Find the difference between two positions expressed as a  vector
   */
  subtract(right: IPosition): IVector;
}

export interface IPosition2D
  extends IValue<Pair<number>>,
    ITranslatable<IPosition2D>,
    IPosition {
  x(): number;
  y(): number;
  maximum(right: IPosition2D): IPosition2D;
  minimum(right: IPosition2D): IPosition2D;
  subtract(right: IPosition2D): Vector2D;
}

export interface IPosition3D
  extends IValue<Triple<number>>,
    ITranslatable<IPosition3D>,
    IPosition {
  x(): number;
  y(): number;
  z(): number;
  /**
   * construct a new Position3D from the maximum elements of each component
   */
  maximum(right: IPosition3D): IPosition3D;
  /**
   * construct a new Position3D from the miminum elements of each component
   */
  minimum(right: IPosition3D): IPosition3D;
  subtract(right: IPosition3D): Vector3D;
}
