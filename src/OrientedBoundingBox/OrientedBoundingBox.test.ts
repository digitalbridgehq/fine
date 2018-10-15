import { identity } from 'fp-ts/lib/function';

import { OrientedBoundingBox } from './OrientedBoundingBox';
import { AxisAlignedBoundingBox } from '../AxisAlignedBoundingBox';
import { Position3D } from '../Position';
import { AffineTransform3D } from '../AffineTransform';
import { SquareMatrix3D } from '../Matrix';
import { Vector } from '../Vector';

describe('OrientedBoundingBox', () => {
    it('should not be changed by identity values', () => {
        const expected = new AxisAlignedBoundingBox(
            new Position3D(5, 10, 15),
            new Position3D(6, 11, 16),
        );
        const obb = new OrientedBoundingBox(
            expected,
            new AffineTransform3D(
                // prettier-ignore
                new SquareMatrix3D([
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ]),
                new Vector(3, [0, 0, 0]),
            ),
        );

        const actual = obb.axisAlignedBoundingBox().fold(message => {
            throw new Error(message);
        }, identity);

        expect(actual).toEqual(expected);
    });
});
