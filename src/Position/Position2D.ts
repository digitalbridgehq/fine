import { zip } from 'lodash';

import { Pair } from '../util/Pair';
import { IPosition2D } from './interface';
import { Vector2D } from '../Vector/Vector2D';

export class Position2D implements IPosition2D {
    public static fromTuple([x, y]: Pair<number>): Position2D {
        return new Position2D(x, y);
    }

    private _position: [number, number];
    constructor(x: number, y: number) {
        this._position = [x, y];
    }
    public x() {
        return this._position[0];
    }
    public y() {
        return this._position[1];
    }
    public value() {
        return this._position;
    }
    public maximum(right: IPosition2D) {
        const [x, y] = (zip(this.value(), right.value()) as Array<
            Pair<number>
        >).map(([l, r]) => Math.max(l, r));
        return new Position2D(x, y);
    }
    public minimum(right: IPosition2D) {
        const [x, y] = (zip(this.value(), right.value()) as Array<
            Pair<number>
        >).map(([l, r]) => Math.min(l, r));
        return new Position2D(x, y);
    }
    public translate(vector: Vector2D) {
        const [x, y] = vector.value();
        return new Position2D(this.x() + x, this.y() + y);
    }
    public equal(right: IPosition2D) {
        return this.x() === right.x() && this.y() === right.y();
    }
    public greaterThan(right: IPosition2D) {
        return this.x() > right.x() && this.y() > right.y();
    }
    public toString() {
        return `Pos2D(${this.x()}, ${this.y()})`;
    }
}
