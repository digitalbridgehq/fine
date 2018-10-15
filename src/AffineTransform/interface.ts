import { Either } from 'fp-ts/lib/Either';

import { IPosition3D } from '../Position/interface';
import { IAxisAlignedBoundingBox } from '../AxisAlignedBoundingBox/interface';
import { CubeCorners } from '../Cube';

export interface IAffineTransform {
    /**
     * produce a new IAffineTransform3D which represents the inverse of this one
     */
    inverse(): Either<string, IAffineTransform>;
    /**
     * transform the position provided.
     *  Possible Left values include:
     *   - Matrix.ERR_CANNOT_ADD_DIMENSIONS_DIFFER
     *   - Matrix.ERR_CANNOT_MULTIPLY_INCOMPATIBLE_DIMENSIONS
     *
     */
    position(pos: IPosition3D): Either<string, IPosition3D>;
    /**
     * transform the AxisAlignedBoundingBox provided into a new AxisAlignedBoundingBox.
     *  Possible Left values include:
     *   - Matrix.ERR_CANNOT_ADD_DIMENSIONS_DIFFER
     *   - Matrix.ERR_CANNOT_MULTIPLY_INCOMPATIBLE_DIMENSIONS
     */
    axisAlignedBoundingBox(
        aabb: IAxisAlignedBoundingBox,
    ): Either<string, IAxisAlignedBoundingBox>;

    /**
     * given an axisAlignedBoundingBox, return the transformed corners.
     * Possible left values include:
     *   - Matrix.ERR_CANNOT_ADD_DIMENSIONS_DIFFER
     *   - Matrix.ERR_CANNOT_MULTIPLY_INCOMPATIBLE_DIMENSIONS
     */
    cornersFromAxisAlignedBoundingBox(
        aabb: IAxisAlignedBoundingBox,
    ): Either<string, CubeCorners>;
}
