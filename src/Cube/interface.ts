import { IPosition3D } from '../Position/interface';

export type CubeCorners = [
    IPosition3D,
    IPosition3D,
    IPosition3D,
    IPosition3D,
    IPosition3D,
    IPosition3D,
    IPosition3D,
    IPosition3D
];

export type NamedCubeCorners = {
    'left-top-rear': IPosition3D;
    'right-top-rear': IPosition3D;
    'left-bottom-rear': IPosition3D;
    'right-bottom-rear': IPosition3D;
    'left-top-front': IPosition3D;
    'right-top-front': IPosition3D;
    'left-bottom-front': IPosition3D;
    'right-bottom-front': IPosition3D;
};
