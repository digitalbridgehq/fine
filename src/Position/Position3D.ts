import { Either, left } from 'fp-ts/lib/Either';
import { zip } from 'lodash';

import { Pair } from '../util/Pair';
import { Triple } from '../util/Triple';

import { IMatrix } from '../Matrix';
import { Vector3D } from '../Vector';
import { IPosition3D } from './interface';

export class Position3D implements IPosition3D {
    public static fromTuple([x, y, z]: [number, number, number]): Position3D {
        return new Position3D(x, y, z);
    }

    public static fromMatrix(matrix: IMatrix): Either<string, Position3D> {
        if (matrix.rows() === 1 && matrix.columns() === 3) {
            return matrix
                .row(0)
                .map(pos => pos.value())
                .map(([x, y, z]) => new Position3D(x, y, z));
        } else if (matrix.columns() === 1 && matrix.rows() === 3) {
            return matrix
                .column(0)
                .map(pos => pos.value())
                .map(([x, y, z]) => new Position3D(x, y, z));
        } else {
            return left(
                '[Pos3D]: Validation Error - unable to construct Pos3D from Matrix',
            );
        }
    }
    private _position: [number, number, number];
    constructor(x: number, y: number, z: number) {
        this._position = [x, y, z];
    }
    public x() {
        return this._position[0];
    }
    public y() {
        return this._position[1];
    }
    public z() {
        return this._position[2];
    }
    public value() {
        return this._position;
    }
    public maximum(right: IPosition3D) {
        const [x, y, z] = (zip(this.value(), right.value()) as Triple<
            Pair<number>
        >).map(([l, r]) => Math.max(l, r));
        return new Position3D(x, y, z);
    }
    public minimum(right: IPosition3D) {
        const [x, y, z] = (zip(this.value(), right.value()) as Triple<
            Pair<number>
        >).map(([l, r]) => Math.min(l, r));
        return new Position3D(x, y, z);
    }

    public translate(vector: Vector3D) {
        const [x, y, z] = vector.value();
        return new Position3D(this.x() + x, this.y() + y, this.z() + z);
    }

    public equal(right: IPosition3D) {
        return (
            this.x() === right.x() &&
            this.y() === right.y() &&
            this.z() === right.z()
        );
    }

    public greaterThan(right: IPosition3D) {
        return (
            this.x() > right.x() && this.y() > right.y() && this.z() > right.z()
        );
    }
}
