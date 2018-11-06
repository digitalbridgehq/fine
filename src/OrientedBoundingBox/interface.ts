import { IPosition3D } from '../Position';
import { AxisAlignedBoundingBox } from '../AxisAlignedBoundingBox';
import { AffineTransform3D } from '../AffineTransform';
import { CubeCorners, NamedCubeCorners } from '../Cube';
import { FineResult } from '../interface';

export interface IOrientedBoundingBox {
    /**
     * expose the underlying AxisAlignedBoundingBox max
     */
    max(): IPosition3D;
    /**
     * expose the underlying AxisAlignedBoundingBox min
     */
    min(): IPosition3D;
    /**
     * the corners of the OrientedBoundedBox
     */
    corners(): FineResult<string, CubeCorners>;
    /**
     * the {@link NamedCubeCorners} of the OrientedBoundingBox
     */
    namedCorners(): FineResult<string, NamedCubeCorners>;
    /**
     * the internal AxisAlignedBoundingBox this OrientedBoundingBox is constructed with
     */
    rawAxisAlignedBoundingBox(): AxisAlignedBoundingBox;
    /**
     * return the enclosing AxisAlignedBoundingBox of this OrientedBoundingBox
     */
    axisAlignedBoundingBox(): FineResult<string, AxisAlignedBoundingBox>;
    /**
     * union of two OrientedBoundingBoxes, produces a new OBB in the left OBBs space
     */
    union(right: IOrientedBoundingBox): FineResult<string, IOrientedBoundingBox>;
    /**
     * the affine transform in 3D space associated with this IOrientedBoundingBox
     */
    affineTransform(): AffineTransform3D;
}
