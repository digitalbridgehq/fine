import { Position3D as Pos3D } from './Position3D';

describe('Pos3D', () => {
    it('represents a position in 3D', () => {
        const pos = new Pos3D(2, 4, 8);

        const expectedX = 2;
        const expectedY = 4;
        const expectedZ = 8;

        const actualX = pos.x();
        const actualY = pos.y();
        const actualZ = pos.z();

        const expected = [2, 4, 8];
        const actual = pos.value();

        expect(actualX).toBe(expectedX);
        expect(actualY).toBe(expectedY);
        expect(actualZ).toBe(expectedZ);

        expect(actual).toEqual(expected);
    });

    describe('maximum', () => {
        it('returns a Pos3D composed of the largest elements of the starting Pos3Ds', () => {
            const left = new Pos3D(8, 100, 3);
            const right = new Pos3D(3, 35, 200);
            const expected = new Pos3D(8, 100, 200);
            const actual = left.maximum(right);
            expect(actual).toEqual(expected);
        });
    });
    describe('minimum', () => {
        it('returns a Pos3D composed of the smallest elements of the starting Pos3Ds', () => {
            const left = new Pos3D(8, 100, 3);
            const right = new Pos3D(3, 35, 200);
            const expected = new Pos3D(3, 35, 3);
            const actual = left.minimum(right);
            expect(actual).toEqual(expected);
        });
    });
});
