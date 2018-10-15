import { IValue } from '../Value/interface';
import { Either } from 'fp-ts/lib/Either';

export interface IVector extends IValue<Array<number>> {
    /**
     * the number of elements contained in the Vector
     */
    dimensionality(): number;
    /**
     * dot multiplication of the this and the provided vector.
     *   Note: Both vectors must be of the same dimensionality for an accurate result
     */
    dot(right: IVector): number;
    scale(scalar: number): IVector;
    sum(right: IVector): Either<string, IVector>;
}
