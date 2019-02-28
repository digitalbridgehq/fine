import { Vector } from './Vector';
import { Vector3D } from '.';

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

    describe('cross', () => {
        it('should generate correct results for a standard set of permutations', () => {
            const zero = new Vector(3, [0, 0, 0]);
            const x = new Vector(3, [1, 0, 0]);
            const y = new Vector(3, [0, 1, 0]);
            const z = new Vector(3, [0, 0, 1]);
            const negZ = new Vector(3, [0, 0, -1]);
            const negY = new Vector(3, [0, -1, 0]);
            const negX = new Vector(3, [-1, 0, 0]);

            // test cyclic permutations of vectors eg.(x.cross(y) = z, y.cross(z)= x, z.cross(x) = y)
            expect(x.cross(y)).toEqual(z);
            expect(y.cross(z)).toEqual(x);
            expect(z.cross(x)).toEqual(y);

            // test acyclic permutations of vectors eg.(y.cross(x) = -z, z.cross(y) = -x, x.cross(z) = -y
            expect(y.cross(x)).toEqual(negZ);
            expect(z.cross(y)).toEqual(negX);
            expect(x.cross(z)).toEqual(negY);

            // test each vector against itself eg.(x.cross(x),y.cross(y),z.cross(z)) should be 0
            expect(x.cross(x)).toEqual(zero);
            expect(y.cross(y)).toEqual(zero);
            expect(z.cross(z)).toEqual(zero);
        });

        it('should throw when attempting to cross a vector with wrong dimensionality', () => {
            const vec1 = new Vector(2, [0, 0]);
            const vec2 = new Vector(3, [0, 0, 0]);

            // test lhs is 2d, rhs is 3d
            expect(() => vec1.cross(vec2)).toThrow();
            // test rhs is 3d, lhs is 2d
            expect(() => vec2.cross(vec1)).toThrow();
            // test lhs is 2d, rhs is 2d
            expect(() => vec1.cross(vec1)).toThrow();
        });
    });

    describe('normalise', () => {
        it('should normalise the given vector', () => {
            const vec1 = new Vector(2, [1, 2]);
            const vec2 = new Vector(3, [3, 4, 5]);
            const vec3 = new Vector(4, [6, 7, 8, 9]);

            // Test that the results are normalised
            expect(vec1.normalise().mag()).toBeCloseTo(1);
            expect(vec2.normalise().mag()).toBeCloseTo(1);
            expect(vec3.normalise().mag()).toBeCloseTo(1);

            // Test actual normalised direction
            expect(vec1.normalise().dot(vec1)).toBeCloseTo(vec1.mag());
            expect(vec2.normalise().dot(vec2)).toBeCloseTo(vec2.mag());
            expect(vec3.normalise().dot(vec3)).toBeCloseTo(vec3.mag());
        });
    });
});
