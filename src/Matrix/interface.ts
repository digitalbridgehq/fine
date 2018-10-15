import { Either } from 'fp-ts/lib/Either';

import { IValue } from '../Value';
import { ISum } from '../Sum';
import { IVector } from '../Vector';

export interface IMatrix extends ISum<IMatrix>, IValue<Array<number>> {
    /** does an IMatrix match dimensions? */
    matchesDimensions(n: IMatrix): boolean;
    /** how many rows does IMatrix have */
    rows(): number;
    /** how many columns does IMatrix have */
    columns(): number;
    /** scale IMatrix by a factor */
    scale(scalar: number): IMatrix;
    /**
     * fetch the row at index, given a zero-based index
     */
    row(index: number): Either<string, IVector>;
    /**
     * fetch the column at index, given a zero-based index
     */
    column(index: number): Either<string, IVector>;
    /**
     * multiply two compatible Matrices together
     */
    multiply(right: IMatrix): Either<string, IMatrix>;
    /**
     * transpose the provided Matrix
     * https://en.wikipedia.org/wiki/Transpose
     */
    transpose(): Either<string, IMatrix>;
    /**
     * apply the provided function to the entire contents of the Matrix, producing a new Matrix.
     * The returned array is expected to be of the same dimensionality as the provided one.
     */
    map(fn: (ns: Array<number>) => Array<number>): IMatrix;
}
