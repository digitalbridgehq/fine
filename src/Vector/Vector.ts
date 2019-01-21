import { Either, left, right } from 'fp-ts/lib/Either';
import { zip } from 'lodash';

import { ZeroArray } from '../util/ZeroArray';
import { IVector } from './interface';
import { IMatrix } from '../Matrix/interface';
import { Pair } from '../util/Pair';

export class Vector implements IVector {
    /**
     * produce a Vector from a single column or single row matrix.
     *  returns a Left given a Matrix where neither a column nor a row is set to 1
     */
    public static fromMatrix(mat: IMatrix): Either<string, IVector> {
        if (mat.rows() === 1) {
            return mat.row(0);
        } else if (mat.columns() === 1) {
            return mat.column(0);
        } else {
            return left(
                '[Vector]: Validation Error - Matrix is not convertable to a Vector'
            );
        }
    }

    private _contents: Array<number> = [];
    constructor(
        private _dimensionality: number,
        initialContents: Array<number> = []
    ) {
        this._contents =
            initialContents.length === _dimensionality
                ? initialContents
                : new ZeroArray(_dimensionality);
    }
    public dimensionality() {
        return this._dimensionality;
    }
    public value() {
        return this._contents;
    }
    public dot(right: IVector) {
        return (zip(this.value(), right.value()).filter(
            ([left, right]) => left !== undefined && right !== undefined
        ) as Array<[number, number]>)
            .map(([left, right]) => left * right)
            .reduce((a, b) => a + b, 0);
    }
    public scale(scalar: number): Vector {
        return new Vector(
            this._dimensionality,
            this._contents.map((n) => n * scalar)
        );
    }

    public sum(rightVector: IVector): Either<string, Vector> {
        if (this._dimensionality !== rightVector.dimensionality()) {
            return left(
                '[Vec]: unable to sum vectors with different dimensionality'
            );
        } else {
            return right(
                new Vector(
                    this._dimensionality,
                    (zip(this.value(), rightVector.value()) as Array<
                        Pair<number>
                    >).map(([l, r]) => l + r)
                )
            );
        }
    }

    public sub(rightVector: IVector): Either<string, Vector> {
        if (this._dimensionality !== rightVector.dimensionality()) {
            return left(
                '[Vec]: unable to subtract vectors with different dimensionality'
            );
        } else {
            return right(
                new Vector(
                    this._dimensionality,
                    (zip(this.value(), rightVector.value()) as Array<
                        Pair<number>
                    >).map(([l, r]) => l - r)
                )
            );
        }
    }
}
