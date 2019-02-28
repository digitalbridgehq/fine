import { IVector, Vector } from './';
import * as Either from 'fp-ts/lib/Either';
import { Pair } from 'util/Pair';

/**
 * a {@link Vector} constrained to a dimensionality of 2
 */
export class Vector2D implements IVector {
    private _vec: Vector;
    constructor(initialContents: Array<number>) {
        this._vec = new Vector(2, initialContents);
    }
    public dimensionality() {
        return this._vec.dimensionality();
    }
    public value() {
        return this._vec.value();
    }
    public dot(right: Vector2D): number {
        return this._vec.dot(right);
    }
    public scale(scalar: number): Vector2D {
        return new Vector2D(this._vec.scale(scalar).value());
    }
    public sum(right: Vector2D): Either.Either<string, Vector2D> {
        return this._vec.sum(right).map((vec) => new Vector2D(vec.value()));
    }
    public sub(right: Vector2D): Either.Either<string, Vector2D> {
        return this._vec.sub(right).map((vec) => new Vector2D(vec.value()));
    }
    public normalise(): Vector2D {
        return new Vector2D(this._vec.normalise().value() as Pair<number>);
    }
    public cross(right: IVector): IVector {
        throw new Error(
            'Cannot perform cross on a Vector 2D, wrong dimensionality (2 when it should be at least 3)'
        );
    }
    public neg(): Vector2D {
        return new Vector2D(this._vec.neg().value());
    }
    public mag(): number {
        return this.mag();
    }
    public toString() {
        const [l, r] = this._vec.value();
        return `Vector2D( ${l}, ${r} )`;
    }
}
