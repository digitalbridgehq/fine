import { left, right } from 'fp-ts/lib/Either';

import { ISquareMatrix } from './interface';
import { IMatrix } from '../interface';
import { Matrix } from '../Matrix';
import { IVector } from '../../Vector';
import { FineResult } from '../../interface';

/**
 * a Matrix which contains the same number of rows and columns.
 */
export class SquareMatrix implements ISquareMatrix {
    /**
     * the Error message when attempting to find the inverse
     *  of a Matrix of any size other than 2x2 or 3x3
     */
    public static ERR_CANNOT_INVERT_WRONG_SIZE =
        '[SquareMatrix]: unable to invert matrix larger than 3x3';
    /**
     * the Error message when attempting to find the inverse
     *  of a singular Matrix
     */
    public static ERR_CANNOT_INVERT_SINGULAR =
        '[SquareMatrix]: unable to invert singular matrix';
    /**
     * the Error message when attempting to find the determinant
     *  of a Matrix of any size other than 2x2 or 3x3
     */
    public static ERR_NO_DETERMINANT_WRONG_SIZE =
        '[SquareMatrix]: unable to find determinant for Matrices larger than 3x3';
    private _matrix: IMatrix;
    constructor(size: number, initialContents: Array<number> = []) {
        this._matrix = new Matrix(size, size, initialContents);
    }
    public matchesDimensions(n: IMatrix) {
        return (
            this._matrix.columns() === n.columns() &&
            this._matrix.columns() === n.rows()
        );
    }
    public rows() {
        return this._matrix.rows();
    }
    public columns() {
        return this._matrix.columns();
    }
    public scale(scalar: number): SquareMatrix {
        return new SquareMatrix(
            this._matrix.rows(),
            this._matrix.scale(scalar).value(),
        );
    }
    public row(index: number): FineResult<string, IVector> {
        return this._matrix.row(index);
    }
    public column(index: number): FineResult<string, IVector> {
        return this._matrix.column(index);
    }
    public multiply(right: IMatrix): FineResult<string, IMatrix> {
        return this._matrix.multiply(right);
    }
    public sum(right: IMatrix) {
        return this._matrix
            .sum(right)
            .map(result => new SquareMatrix(this.rows(), result.value()));
    }
    public value() {
        return this._matrix.value();
    }
    public transpose(): FineResult<string, SquareMatrix> {
        return this._matrix
            .transpose()
            .map(matrix => new SquareMatrix(this.rows(), matrix.value()));
    }
    public map(fn: (ns: Array<number>) => Array<number>): SquareMatrix {
        return new SquareMatrix(this.rows(), this._matrix.map(fn).value());
    }

    /**
     * expose the determinant of the Matrix for 2x2 & 3x3 Matrices:
     *      https://en.wikipedia.org/wiki/Determinant
     *
     * for Matrices of different sizes, returns a Left of
     *      the string {@link SquareMatrix.ERR_NO_DETERMINANT_WRONG_SIZE}
     */
    public determinant(): FineResult<string, number> {
        if (this.rows() === 2) {
            const value = this._matrix.value();
            // prettier-ignore
            return right(
                value[0] * value[3] - 
                value[1] * value[2]
            );
        } else if (this.rows() === 3) {
            const value = this._matrix.value();
            // prettier-ignore
            return right(
                value[0] * value[4] * value[8] +
                value[1] * value[5] * value[6] +
                value[2] * value[3] * value[7] -
                value[0] * value[5] * value[7] -
                value[1] * value[3] * value[8] -
                value[2] * value[4] * value[6]
            );
        } else {
            return left(SquareMatrix.ERR_NO_DETERMINANT_WRONG_SIZE);
        }
    }
    /**
     * return the inverse of the Matrix for 2x2 & 3x3 Matrices:
     *      https://en.wikipedia.org/wiki/Invertible_matrix#Inversion_of_2_%C3%97_2_matrices
     *
     *  for any other size,
     *      returns a Left of the string {@link SquareMatrix.ERR_CANNOT_INVERT_TOO_LARGE}
     *
     *  for singular Matrices (those without an inverse),
     *      returns a Left of the string {@link SquareMatrix.ERR_CANNOT_INVERT_SINGULAR}
     */
    public inverse(): FineResult<string, SquareMatrix> {
        return (
            this.determinant()
                // explainer comments for what might look like 'weird' Either stuff.
                // I know they're saying what the code does, but they can be removed later
                //
                //
                // handle error state for singular matrix
                .chain<number>(
                    determinant =>
                        determinant === 0
                            ? left(SquareMatrix.ERR_CANNOT_INVERT_SINGULAR)
                            : right(determinant),
                )
                // convert error state for no determinant when matrix too large to cannot invert, matrix too large
                .mapLeft(
                    errorMessage =>
                        errorMessage ===
                        SquareMatrix.ERR_NO_DETERMINANT_WRONG_SIZE
                            ? SquareMatrix.ERR_CANNOT_INVERT_WRONG_SIZE
                            : errorMessage,
                )
                // because errors are propagated, here we know for sure that this.rows is either 2 or 3, and that determinant is not 0
                .chain(determinant => {
                    if (this.rows() === 2) {
                        return right(
                            this.map(([a, b, c, d]) => [d, -b, -c, a]).scale(
                                1 / determinant,
                            ),
                        );
                    } else if (this.rows() === 3) {
                        const intermediate = this.map((
                            // prettier-ignore
                            [
                                    a, b, c,
                                    d, e, f,
                                    g, h, i
                            ],
                        ) =>
                            // prettier-ignore
                            [
                                     ((e * i) - (f * h)), -((d * i) - (f * g)),  ((d * h) - (e * g)),
                                    -((b * i) - (c * h)),  ((a * i) - (c * g)), -((a * h) - (b * g)),
                                     ((b * f) - (c * e)), -((a * f) - (c * d)),  ((a * e) - (b * d))
                            ],
                        );

                        return intermediate
                            .transpose()
                            .map(transposed =>
                                transposed.scale(1 / determinant),
                            );
                    } else {
                        // TODO: improve this. included for exhaustivity
                        return left('[SquareMatrix] Something went very wrong');
                    }
                })
        );
    }
}
