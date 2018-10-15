import { IPosition3D, Position3D } from '../Position';
import { Triple } from '../util/Triple';
import { CubeCorners } from '../Cube';
import { Range } from '../util/Range';

import { IAxisAlignedBoundingBox } from './interface';

export class AxisAlignedBoundingBox implements IAxisAlignedBoundingBox {
    public static fromTuple(min: Triple<number>, max: Triple<number>) {
        return new AxisAlignedBoundingBox(
            Position3D.fromTuple(min),
            Position3D.fromTuple(max),
        );
    }
    private _min: IPosition3D;
    private _max: IPosition3D;
    constructor(min: IPosition3D, max: IPosition3D) {
        this._min = min.minimum(max);
        this._max = max.maximum(min);
    }
    /**
     * a tuple of the minimum position and the maximum position
     *  e.g.
     *
     * `[min, max]`
     */
    public value(): [IPosition3D, IPosition3D] {
        return [this._min, this._max];
    }
    public min() {
        return this._min;
    }
    public max() {
        return this._max;
    }
    public union(right: IAxisAlignedBoundingBox) {
        return new AxisAlignedBoundingBox(
            this._min.minimum(right.min()),
            this._max.maximum(right.max()),
        );
    }

    public corners(): CubeCorners {
        const corners = new Range(0, 7);

        // TODO: figure out a way to avoid this ridiculous juggling to please the compiler
        const [a, b, c, d, e, f, g, h] = corners.map(
            i =>
                new Position3D(
                    i & 0b1 ? this._max.x() : this._min.x(),
                    i & 0b10 ? this._max.y() : this._min.y(),
                    i & 0b100 ? this._max.z() : this._min.z(),
                ),
        );

        return [a, b, c, d, e, f, g, h] as CubeCorners;
    }
}
