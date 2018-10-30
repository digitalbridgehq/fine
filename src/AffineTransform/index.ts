import { right, left } from 'fp-ts/lib/Either';

import { IAffineTransform } from './interface';
import { SquareMatrix3D, Matrix } from '../Matrix';
import { IVector, Vector } from '../Vector';
import { IPosition3D as IPos3D, Position3D } from '../Position';
import { AxisAlignedBoundingBox } from '../AxisAlignedBoundingBox';
import { CubeCorners } from '../Cube';
import { Pair } from '../util/Pair';
import { FineResult } from '../interface';

export { IAffineTransform };

// TODO: export this to AffineTransform.ts
export class AffineTransform3D implements IAffineTransform {
    /**
     * return the identity transform
     */
    public static identity(): AffineTransform3D {
        return new AffineTransform3D(
            SquareMatrix3D.identity(),
            new Vector(3, [0, 0, 0]),
        );
    }
    constructor(
        private _transform: SquareMatrix3D,
        private _translation: IVector,
    ) {}

    public inverse() {
        return this._transform.inverse().chain(inverseMatrix =>
            inverseMatrix
                .multiply(new Matrix(3, 1, this._translation.value()))
                // chain runs a fn `across` an Either, which means that
                // if (and only if) the Either is a Right, the Either is
                // unwrapped and passed to the function, and expects you to
                // return another Either. This allows us to 'merge' two Eithers
                // together.
                // it behaves like map, in that this will only run if the Either is
                // a Right
                .chain(multipliedMatrix => Vector.fromMatrix(multipliedMatrix))
                .chain(translationVector =>
                    right(
                        new AffineTransform3D(inverseMatrix, translationVector),
                    ),
                ),
        );
    }
    public position(pos: IPos3D) {
        return this._transform
            .multiply(Matrix.columnFromPos3D(pos))
            .chain(multipliedMatrix =>
                multipliedMatrix.sum(
                    Matrix.columnFromVector(this._translation),
                ),
            )
            .chain(matrix => Position3D.fromMatrix(matrix));
    }

    public cornersFromAxisAlignedBoundingBox(
        aabb: AxisAlignedBoundingBox,
    ): FineResult<string, CubeCorners> {
        return this.rawCornersFromAxisAlignedBoundingBox(aabb).reduce(
            (
                result: FineResult<string, Array<IPos3D>>,
                eitherPos: FineResult<string, IPos3D>,
            ) => eitherPos.map(pos => result.getOrElse([]).concat(pos)),
            left(''),
        ) as FineResult<string, CubeCorners>;
    }

    /**
     * given an AxisAlignedBoundingBox, return a new AxisAlignedBoundingBox after the transform has been applied
     */
    public axisAlignedBoundingBox(aabb: AxisAlignedBoundingBox) {
        return this.rawCornersFromAxisAlignedBoundingBox(aabb)
            .reduce((result, eitherPos) => {
                return eitherPos.chain(pos =>
                    result.map(
                        ([min, max]) =>
                            [pos.minimum(min), pos.maximum(max)] as Pair<
                                Position3D
                            >,
                    ),
                );
            }, right([new Position3D(Infinity, Infinity, Infinity), new Position3D(-Infinity, -Infinity, -Infinity)] as [Position3D, Position3D]))
            .map(([min, max]) => new AxisAlignedBoundingBox(min, max));
    }

    private rawCornersFromAxisAlignedBoundingBox(aabb: AxisAlignedBoundingBox) {
        return aabb.corners().map(pos => this.position(pos));
    }
}
