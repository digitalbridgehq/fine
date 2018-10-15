import { AxisAlignedBoundingBox } from '../AxisAlignedBoundingBox';
import { AffineTransform3D } from '../AffineTransform';
import { IPosition3D } from '../Position';

import { IOrientedBoundingBox } from './interface';
import { Either } from 'fp-ts/lib/Either';
import { CubeCorners } from '../Cube';

export class OrientedBoundingBox implements IOrientedBoundingBox {
    private _aabb: AxisAlignedBoundingBox;
    private _transform: AffineTransform3D;
    constructor(
        axisAlignedBoundingBox: AxisAlignedBoundingBox,
        transform: AffineTransform3D,
    ) {
        this._aabb = axisAlignedBoundingBox;
        this._transform = transform;
    }
    public max(): IPosition3D {
        return this._aabb.max();
    }
    public min(): IPosition3D {
        return this._aabb.min();
    }
    public affineTransform() {
        return this._transform;
    }
    public rawAxisAlignedBoundingBox() {
        return this._aabb;
    }
    public corners(): Either<string, CubeCorners> {
        return this._transform.cornersFromAxisAlignedBoundingBox(this._aabb);
    }
    public axisAlignedBoundingBox() {
        return this._transform.axisAlignedBoundingBox(this._aabb);
    }
    public union(right: IOrientedBoundingBox) {
        return right
            .axisAlignedBoundingBox()
            .chain(rightAABB =>
                this._transform
                    .inverse()
                    .chain(inverseTransform =>
                        inverseTransform.axisAlignedBoundingBox(rightAABB),
                    ),
            )
            .map(transformedAABB => this._aabb.union(transformedAABB))
            .map(
                unionAABB =>
                    new OrientedBoundingBox(unionAABB, this._transform),
            );
    }
}
