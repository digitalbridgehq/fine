import { IPosition3D } from '../Position/interface';
import { IValue } from '../Value/interface';
import { CubeCorners } from '../Cube';

export interface IAxisAlignedBoundingBox
    extends IValue<[IPosition3D, IPosition3D]> {
    /**
     * the minimum position for the IAxisAlignedBoundingBox
     */
    min(): IPosition3D;
    /**
     * the maximum position for the IAxisAlignedBoundingBox
     */
    max(): IPosition3D;
    /**
     * produce a new AxisAlignedBoundingBox as the union of two others
     */
    union(right: IAxisAlignedBoundingBox): IAxisAlignedBoundingBox;
    /**
     * calculated corners for the AxisAlignedBoundingBox. The array of corners is in the following order:
     *  left-top-rear
     *  right-top-rear
     *  left-bottom-rear
     *  right-bottom-rear
     *  left-top-front
     *  right-top-front
     *  left-bottom-front
     *  right-bottom-front
     */
    corners(): CubeCorners;
}
