import { Either, left, right } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { Matrix } from './Matrix';
import { Vector } from '../Vector';

describe('Matrix', () => {
    describe('static', () => {
        describe('fromArray', () => {
            it('should return a Either.Right of a Matrix from the provided data', () => {
                const expected: Either<string, Matrix> = right(
                    // prettier-ignore
                    new Matrix(2, 2, [
                        1, 2,
                        3, 4
                    ]),
                );
                // prettier-ignore
                const actual = Matrix.fromArray(2, 2, [
                    1, 2,
                    3, 4
                ]);
                expect(actual).toEqual(expected);
            });
            it('should return an Either.Left describing the issue if unable to construct', () => {
                const expected: Either<string, Matrix> = left(
                    Matrix.ERR_CANNOT_CONSTRUCT_INVALID_LENGTH,
                );
                const actual = Matrix.fromArray(1, 1, [1, 2, 3, 4]);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe('construction', () => {
        it('builds a matrix of the correct size', () => {
            const m = new Matrix(2, 16);

            expect(m.rows()).toBe(2);
            expect(m.columns()).toBe(16);
        });

        it('builds a zero-matrix by default', () => {
            const m = new Matrix(2, 5);
            const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            const actual = m.value();

            expect(actual).toEqual(expected);
        });

        it('successfully builds a single-column zero-matrix', () => {
            const m = new Matrix(5, 1);
            const expected = [0, 0, 0, 0, 0];
            const actual = m.value();

            expect(actual).toEqual(expected);
        });

        it('successfully builds a single-row zero-matrix', () => {
            const m = new Matrix(1, 9);
            // prettier-ignore
            const expected = [
            /** 1, 2, 3, 4, 5, 6, 7, 8, 9 */
                0, 0, 0, 0, 0, 0, 0, 0, 0
            ];
            const actual = m.value();

            expect(actual).toEqual(expected);
        });

        it('accepts an initial value argument', () => {
            const m = new Matrix(2, 2, [2, 4, 6, 8]);
            const expected = [2, 4, 6, 8];
            const actual = m.value();

            expect(actual).toEqual(expected);
        });

        it('builds a single-column matrix with an initial value', () => {
            const m = new Matrix(5, 1, [1, 2, 3, 4, 5]);
            const expected = [1, 2, 3, 4, 5];

            const actual = m.value();

            expect(actual).toEqual(expected);
        });
    });

    describe('addition', () => {
        it('can add two matrices with the same dimensions', () => {
            const m = new Matrix(1, 5, [0, 1, 2, 3, 4]);
            const n = new Matrix(1, 5, [0, 1, 2, 3, 4]);

            const expected = [0, 2, 4, 6, 8];
            const actual = m
                .sum(n)
                .getOrElse(new Matrix(1, 1))
                .value();

            expect(actual).toEqual(expected);
        });

        it('creates a new matrix rather than editing the matrix in place', () => {
            const m = new Matrix(2, 4);
            const n = new Matrix(2, 4);

            const o = m.sum(n).fold(() => m, identity);

            expect(o).not.toBe(m);
            expect(o).not.toBe(n);
        });
        it('throws an error when matrices dont have the same dimensions', () => {
            const m = new Matrix(2, 4);
            const n = new Matrix(2, 5);

            const expected: Either<string, Matrix> = left(
                '[Matrix]: unable to add matrices with differing dimensions',
            );
            const actual = m.sum(n);

            expect(actual).toEqual(expected);
        });
    });

    describe('matchesDimensions', () => {
        it('returns true if the matrices match dimensions', () => {
            const m = new Matrix(2, 4);
            const n = new Matrix(2, 4);

            const expected = true;
            const actual = m.matchesDimensions(n);

            expect(actual).toBe(expected);
        });
        it('returns false if the matrices do not match dimensions', () => {
            const m = new Matrix(2, 4);
            const n = new Matrix(8, 8);

            const expected = false;
            const actual = m.matchesDimensions(n);

            expect(actual).toBe(expected);
        });
    });

    describe('scale', () => {
        it('should scale the matrix by the provided factor', () => {
            const m = new Matrix(1, 8, [1, 2, 1, 1, 2, 1, 1, 3]);

            const n = m.scale(2);

            const expected = [2, 4, 2, 2, 4, 2, 2, 6];
            const actual = n.value();

            expect(actual).toEqual(expected);
        });
    });

    describe('row', () => {
        it('retrieves the requested zero-indexed row', () => {
            const m = new Matrix(3, 3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
            const throwErr = (message: string) => {
                throw new Error(message);
            };

            m.row(0).fold(throwErr, row =>
                expect(row).toEqual(new Vector(3, [1, 1, 1])),
            );
            m.row(1).fold(throwErr, row =>
                expect(row).toEqual(new Vector(3, [2, 2, 2])),
            );
            m.row(2).fold(throwErr, row =>
                expect(row).toEqual(new Vector(3, [3, 3, 3])),
            );

            const m_ = new Matrix(2, 3, [2, 3, 4, 1, 0, 0]);

            m_.row(0).fold(throwErr, row =>
                expect(row).toEqual(new Vector(3, [2, 3, 4])),
            );
            m_.row(1).fold(throwErr, row =>
                expect(row).toEqual(new Vector(3, [1, 0, 0])),
            );
        });
    });

    describe('column', () => {
        it('retrieves the requested zero-indexed column', () => {
            const m = new Matrix(3, 3, [1, 2, 3, 1, 2, 3, 1, 2, 3]);
            const throwErr = (message: string) => {
                throw new Error(message);
            };

            m.column(0).fold(throwErr, col =>
                expect(col).toEqual(new Vector(3, [1, 1, 1])),
            );
            m.column(1).fold(throwErr, col =>
                expect(col).toEqual(new Vector(3, [2, 2, 2])),
            );
            m.column(2).fold(throwErr, col =>
                expect(col).toEqual(new Vector(3, [3, 3, 3])),
            );
        });
    });

    describe('multiply', () => {
        it('returns an Either of a Matrix that is the result of performing multiplication on the original matrices', () => {
            const m = new Matrix(2, 3, [2, 3, 4, 1, 0, 0]);
            const n = new Matrix(3, 2, [0, 1000, 1, 100, 0, 10]);
            const expected: Either<string, Matrix> = right(
                new Matrix(2, 2, [3, 2340, 0, 1000]),
            );
            const actual = m.multiply(n);
            expect(actual).toEqual(expected);
        });
        it('returns a Left of a String in the case the Matrix could not be multiplied', () => {
            const m = new Matrix(2, 3, [2, 3, 4, 1, 0, 0]);
            const n = new Matrix(2, 3, [0, 0, 0, 0, 0, 0]);
            const expected: Either<string, Matrix> = left(
                '[Matrix]: Unable to multiply matrices with incompatible dimensions',
            );
            const actual = m.multiply(n);

            expect(actual).toEqual(expected);
        });
    });
    describe('transposition', () => {
        it('transposes a matrix', () => {
            // prettier-ignore
            const m = new Matrix(3, 4, [
                0, 1, 2 , 3 ,
                4, 5, 6 , 7 ,
                8, 9, 10, 11,
            ]);
            // prettier-ignore
            const expected = right<string, Matrix>(new Matrix(4, 3, [
                0, 4, 8 ,
                1, 5, 9 ,
                2, 6, 10,
                3, 7, 11,
            ]));
            const actual = m.transpose();
            expect(actual).toEqual(expected);
        });
    });
    describe('map', () => {
        it('allows for the elements of a matrix to be transformed by arbitrary functions', () => {
            const inverse = (n: number) => -n;
            const inverses = (ns: Array<number>) => ns.map(inverse);
            const m = new Matrix(2, 2, [0, 1, 2, 3]);
            const expected = new Matrix(2, 2, [-0, -1, -2, -3]);
            const actual = m.map(inverses);
            expect(actual).toEqual(expected);
        });
    });
});
