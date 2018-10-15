import { right, Either, left } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { zip } from 'lodash';

import { SquareMatrix } from '.';

describe('SquareMatrix', () => {
    describe('construction', () => {
        it('should default to a zero-matrix of the correct size', () => {
            const m = new SquareMatrix(3);
            // prettier-ignore
            const expected = [
                0, 0, 0, 
                0, 0, 0,
                0, 0, 0
            ];
            const actual = m.value();

            expect(actual).toEqual(expected);
        });
        it('should allow for the setting of the initial contents', () => {
            // prettier-ignore
            const m = new SquareMatrix(3, [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ]);
            // prettier-ignore
            const expected = [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ];
            const actual = m.value();
            expect(actual).toEqual(expected);
        });
        it('should throw an error if initial contents are not appropriate', () => {
            try {
                // prettier-ignore
                new SquareMatrix(3, [
                    2, 3, 4,
                    5, 6, 7,
                    8, 9, 10,
                    11
                ]);
            } catch (e) {
                expect(e.message).toBe(
                    '[Matrix]: Construction - unable to build matrix with invalid-length initial contents',
                );
            }
        });
    });

    describe('determinant', () => {
        it('for a 2x2 matrix returns an Either of the determinant', () => {
            // prettier-ignore
            const m = new SquareMatrix(2, [
                5, 3,
                4, 9
            ]);

            const expected: Either<string, number> = right(5 * 9 - 3 * 4);
            const actual = m.determinant();

            expect(actual).toEqual(expected);
        });

        it('for a 3x3 matrix returns an Either of the determinant', () => {
            // prettier-ignore
            const m = new SquareMatrix(3, [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ]);
            const expected: Either<string, number> = right(
                1 * 5 * 9 +
                    2 * 6 * 7 +
                    3 * 4 * 8 -
                    1 * 6 * 8 -
                    2 * 4 * 9 -
                    3 * 5 * 7,
            );
            const actual = m.determinant();

            expect(actual).toEqual(expected);
        });
        it('for a larger matrix returns a Either.left explaining the error', () => {
            // prettier-ignore
            const m = new SquareMatrix(4, [
                2, 3, 4, 5,
                6, 7, 8, 9,
                1, 2, 3, 4,
                5, 6, 7, 8
            ]);
            const expected: Either<string, number> = left(
                '[SquareMatrix]: unable to find determinant for Matrices larger than 3x3',
            );
            const actual = m.determinant();

            expect(actual).toEqual(expected);
        });
    });

    describe('inverse', () => {
        it('finds the inverse of a 2x2 matrix', () => {
            // prettier-ignore
            const m = new SquareMatrix(2, [
                8, 2,
                3, 4
            ]);
            const eitherInverse = m.inverse();
            // prettier-ignore
            const expected = new SquareMatrix(2, [
                1, 0,
                0, 1,
            ]);
            const actual = eitherInverse
                .chain(inverse => inverse.multiply(m))
                .fold(
                    // definitely something that will fail if there was an error
                    () => new SquareMatrix(2),
                    matrix => new SquareMatrix(2, matrix.value()),
                );
            expect(actual).toEqual(expected);
        });

        it('finds the inverse of a 3x3 matrix', () => {
            // prettier-ignore
            const m = new SquareMatrix(3, [
                2, 3 , 44,
                8, 29, 1 ,
                3, 82, 8 ,
            ]);
            const eitherInverse = m.inverse();
            // prettier-ignore
            const expected = new SquareMatrix(3, [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ]);
            const actual = eitherInverse
                .chain(inverse => inverse.multiply(m))
                .fold(() => new SquareMatrix(3), identity);
            const actualAndExpected = zip(actual.value(), expected.value());
            actualAndExpected.forEach(([a, e]) => {
                expect(a).toBeCloseTo(e as number, 0.0000000001);
            });
        });
    });
});
