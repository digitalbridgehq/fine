import { AxisAlignedBoundingBox } from './AxisAlignedBoundingBox';
import { Position3D as Pos3D } from '../Position';
import { CubeCorners } from '../Cube';

describe('AxisAlignedBoundingBox', () => {
    it('represents a Bounding Box with min and max positions', () => {
        const aabb = AxisAlignedBoundingBox.fromTuple([0, 0, 0], [10, 10, 10]);

        const expectedMin = new Pos3D(0, 0, 0);
        const expectedMax = new Pos3D(10, 10, 10);

        const actualMin = aabb.min();
        const actualMax = aabb.max();

        expect(actualMin).toEqual(expectedMin);
        expect(actualMax).toEqual(expectedMax);
    });

    describe('union', () => {
        it('should construct an AABB from the two provided', () => {
            const left = AxisAlignedBoundingBox.fromTuple(
                [0, -8, -22],
                [88, 2, 33],
            );
            const right = AxisAlignedBoundingBox.fromTuple(
                [2, 88, 9],
                [200, 3, 33],
            );

            const expected = AxisAlignedBoundingBox.fromTuple(
                [0, -8, -22],
                [200, 88, 33],
            );
            const actual = left.union(right);

            expect(actual).toEqual(expected);
        });
    });
    describe('corners', () => {
        it('should calculate the corners of the AABB', () => {
            const aabb = AxisAlignedBoundingBox.fromTuple(
                [0, 0, 0],
                [10, 10, 10],
            );

            const expected = [
                new Pos3D(0, 0, 0), //    left-top-rear
                new Pos3D(10, 0, 0), //   right-top-rear
                new Pos3D(0, 10, 0), //   left-bottom-rear
                new Pos3D(10, 10, 0), //  right-bottom-rear
                new Pos3D(0, 0, 10), //   left-top-front
                new Pos3D(10, 0, 10), //  right-top-front
                new Pos3D(0, 10, 10), //  left-bottom-front
                new Pos3D(10, 10, 10), // right-bottom-front
            ] as CubeCorners;
            const actual = aabb.corners();

            expect(actual).toEqual(expected);
        });
    });
});
