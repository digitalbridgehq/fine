import { Vector } from './Vector';

describe('Vector', () => {
    describe('construction', () => {
        it('should create a vector with the correct number of elements', () => {
            const v = new Vector(3);
            const expected = 3;
            const actual = v.dimensionality();
            expect(actual).toBe(expected);
        });
        it('should default to being a zero-vector', () => {
            const v = new Vector(6);
            const expected = [0, 0, 0, 0, 0, 0];
            const actual = v.value();
            expect(actual).toEqual(expected);
        });
        it('should allow for a value override', () => {
            const v = new Vector(3, [2, 2, 2]);
            const expected = [2, 2, 2];
            const actual = v.value();
            expect(actual).toEqual(expected);
        });
    });

    describe('dot', () => {
        it('should calculate the dot product given another vector', () => {
            const v = new Vector(3, [1, 2, 3]);
            const w = new Vector(3, [2, 3, 4]);

            const expected = 1 * 2 + 2 * 3 + 3 * 4;
            const actual = v.dot(w);

            expect(actual).toEqual(expected);
        });
    });
});
