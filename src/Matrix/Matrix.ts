import { left, right } from 'fp-ts/lib/Either';

import { IPosition3D } from '../Position/interface';
import { IVector, Vector } from '../Vector';
import { ZeroArray } from '../util/ZeroArray';
import { Range } from '../util/Range';

import { IMatrix } from './';
import { FineResult } from '../interface';

/**
 * a general i-by-j Matrix of numbers
 */
export class Matrix implements IMatrix {
    public static ERR_CANNOT_CONSTRUCT_INVALID_LENGTH =
        '[Matrix]: unable to construct Matrix with initial contents of invalid length';
    public static ERR_CANNOT_ADD_DIMENSIONS_DIFFER =
        '[Matrix]: unable to add matrices with differing dimensions';
    public static ERR_CANNOT_MULTIPLY_INCOMPATIBLE_DIMENSIONS =
        '[Matrix]: Unable to multiply matrices with incompatible dimensions';
    public static ERR_INDEX_OUT_OF_BOUNDS =
        '[Matrix]: Cannot retrieve, index provided is out of bounds';
    /**
     *  construct a rows-by-columns sized zero-matrix.
     */
    public static zeroMatrix(rows: number, columns: number): Matrix {
        return new Matrix(rows, columns);
    }
    /**
     * construct a Matrix from an existing array.
     * validates that the array is the correct size, given the number of rows and columns.
     * in the case that the array is the incorrect size, returns an Either.Left,
     * otherwise returns an Either.Right of the constructed Matrix
     */
    public static fromArray(
        rows: number,
        columns: number,
        array: Array<number>
    ): FineResult<string, Matrix> {
        return Matrix.invalidConstructor(array, rows, columns)
            ? left(Matrix.ERR_CANNOT_CONSTRUCT_INVALID_LENGTH)
            : right(new Matrix(rows, columns, array));
    }
    public static rowFromPos3D(pos3D: IPosition3D): Matrix {
        return new Matrix(1, 3, pos3D.value());
    }

    public static columnFromPos3D(pos3D: IPosition3D): Matrix {
        return new Matrix(3, 1, pos3D.value());
    }

    public static columnFromVector(vec: IVector): Matrix {
        return new Matrix(vec.dimensionality(), 1, vec.value());
    }

    private static invalidConstructor(
        arr: Array<number>,
        rows: number,
        cols: number
    ): boolean {
        return arr.length !== 0 && arr.length !== rows * cols;
    }

    private _contents: Array<number> = [];
    /**
     * initialContents are not validated when called directly
     */
    constructor(
        private _rows: number,
        private _columns: number,
        initialContents: Array<number> = []
    ) {
        this._contents = this.contents(
            initialContents,
            this._rows * this._columns
        );
    }

    public rows(): number {
        return this._rows;
    }

    public columns(): number {
        return this._columns;
    }

    /**
     * sum two Matrices.
     */
    public sum(rightMatrix: IMatrix): FineResult<string, Matrix> {
        if (!this.matchesDimensions(rightMatrix)) {
            return left(Matrix.ERR_CANNOT_ADD_DIMENSIONS_DIFFER);
        }
        return right(
            new Matrix(
                this._rows,
                this._columns,
                this._contents.map((val, i) => rightMatrix.value()[i] + val)
            )
        );
    }
    public value(): Array<number> {
        return this._contents;
    }
    public matchesDimensions(n: IMatrix) {
        return this._rows === n.rows() && this._columns === n.columns();
    }
    public scale(scalar: number): Matrix {
        return new Matrix(
            this._rows,
            this._columns,
            this._contents.map((val) => val * scalar)
        );
    }
    public row(rowIndex: number): FineResult<string, IVector> {
        if (rowIndex < this._rows) {
            return right<string, IVector>(
                new Vector(
                    this._columns,
                    new Range(0, this._columns - 1)
                        .map((colIndex) => rowIndex * this._columns + colIndex)
                        .map((i) => this._contents[i])
                )
            );
        } else {
            return left<string, Vector>(Matrix.ERR_INDEX_OUT_OF_BOUNDS);
        }
    }
    public column(colIndex: number): FineResult<string, IVector> {
        if (colIndex < this._columns) {
            return right<string, Vector>(
                new Vector(
                    this._rows,
                    new Range(0, this._rows - 1)
                        .map((rowIndex) => rowIndex * this._columns + colIndex)
                        .map((i) => this._contents[i])
                )
            );
        } else {
            return left<string, Vector>(Matrix.ERR_INDEX_OUT_OF_BOUNDS);
        }
    }
    public multiply(rightMatrix: IMatrix): FineResult<string, Matrix> {
        // matrix multiplication can only occur if the number of the left Matrix's rows
        //   are equal to the number of the right Matrix's columns
        return this.columns() !== rightMatrix.rows()
            ? left(Matrix.ERR_CANNOT_MULTIPLY_INCOMPATIBLE_DIMENSIONS)
            : new ZeroArray(this.rows())
                  // first build an array of left row and right col dot results
                  .map((_, rowIndex) =>
                      new ZeroArray(rightMatrix.columns()).map((_, colIndex) =>
                          this.row(rowIndex).chain((row) =>
                              rightMatrix
                                  .column(colIndex)
                                  .map((col) => row.dot(col))
                          )
                      )
                  )
                  // we've ended up with an Array<Array<Result<string, number>>> so reduce it into a single level of array
                  // (this is why chain exists on an Either, stops us from getting Either<string, Either<string, T>>)
                  .reduce((l, r) => l.concat(r), [])
                  // swap an array of eithers into an either of an array
                  // this will preserve the first Left to occur, I believe
                  .reduce(
                      (l, r) =>
                          l.chain((dots) => r.map((dot) => dots.concat(dot))),
                      right<string, Array<number>>([])
                  )
                  .map(
                      (startingValues) =>
                          new Matrix(
                              this.rows(),
                              rightMatrix.columns(),
                              startingValues
                          )
                  );
    }

    public transpose(): FineResult<string, Matrix> {
        return (
            new Range(0, this.columns() - 1)
                .map((i) => this.column(i))
                .map((eitherCol) => eitherCol.map((col) => col.value()))
                // from an Array<Either<string, number[]>> to an Either<string, Array<number>>
                .reduce(
                    (l, r) => l.chain((mat) => r.map((row) => mat.concat(row))),
                    right<string, Array<number>>([])
                )
                .map(
                    (startingValue: Array<number>) =>
                        new Matrix(this.columns(), this.rows(), startingValue)
                )
        );
    }

    public map(fn: (ns: Array<number>) => Array<number>) {
        return new Matrix(this.rows(), this.columns(), fn(this.value()));
    }

    /**
     * given an empty array, contents will return an array of the desired length filled with the given value
     * given a non-empty array, contents will simply return the array
     */
    private contents(arr: Array<number>, desiredLength: number): Array<number> {
        return arr.length === 0 ? new ZeroArray(desiredLength) : arr;
    }
}
