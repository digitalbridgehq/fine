import { IValue } from '../Value/interface';
import { FineResult } from '../interface';

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
    sum(right: IVector): FineResult<string, IVector>;
    sub(right: IVector): FineResult<string, IVector>;
}
