import { AxisAlignedBoundingBox } from '../AxisAlignedBoundingBox';
import { AffineTransform3D } from '../AffineTransform';
import { IPosition3D } from '../Position';

import { IOrientedBoundingBox } from './interface';
import { CubeCorners, NamedCubeCorners } from '../Cube';
import { FineResult } from '../interface';

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
    public corners(): FineResult<string, CubeCorners> {
        return this._transform.cornersFromAxisAlignedBoundingBox(this._aabb);
    }
    public namedCorners(): FineResult<string, NamedCubeCorners> {
        return this.corners().map(corners => ({
            'left-top-rear': corners[0],
            'right-top-rear': corners[1],
            'left-bottom-rear': corners[2],
            'right-bottom-rear': corners[3],
            'left-top-front': corners[4],
            'right-top-front': corners[5],
            'left-bottom-front': corners[6],
            'right-bottom-front': corners[7],
        }));
    }
    public axisAlignedBoundingBox(): FineResult<string, AxisAlignedBoundingBox> {
        return this._transform.axisAlignedBoundingBox(this._aabb);
    }
    public union(right: IOrientedBoundingBox): FineResult<string, OrientedBoundingBox> {
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
