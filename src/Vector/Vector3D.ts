import { Either } from 'fp-ts/lib/Either';
import { IVector, Vector } from './';
import { Triple } from '../util/Triple';

/**
 * a {@link Vector} with a dimensionality of 3
 */
export class Vector3D implements IVector {
    private _vec: IVector;
    constructor(initialContents: Triple<number>) {
        this._vec = new Vector(3, initialContents);
    }
    public dimensionality() {
        return this._vec.dimensionality();
    }
    public value() {
        return this._vec.value();
    }
    public dot(right: Vector3D): number {
        return this._vec.dot(right);
    }
    public scale(scalar: number) {
        return this._vec.scale(scalar);
    }
    public sum(right: Vector3D): Either<string, Vector3D> {
        return this._vec
            .sum(right)
            .map((vec) => new Vector3D(vec.value() as Triple<number>));
    }

    public sub(right: Vector3D): Either<string, Vector3D> {
        return this._vec
            .sub(right)
            .map((vec) => new Vector3D(vec.value() as Triple<number>));
    }

    public normalise(): Vector3D {
        return new Vector3D(this._vec.normalise().value() as Triple<number>);
    }

    public cross(right: Vector3D): Vector3D {
        return new Vector3D(this._vec.cross(right).value() as Triple<number>);
    }

    public neg(): Vector3D {
        return new Vector3D(this._vec.neg().value() as Triple<number>);
    }

    public mag(): number {
        return this._vec.mag();
    }
}
