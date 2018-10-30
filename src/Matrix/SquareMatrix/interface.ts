import { FineResult } from '../../interface';
import { IMatrix } from '../interface';

export interface ISquareMatrix extends IMatrix {
    /**
     * the determinant of this SquareMatrix
     */
    determinant(): FineResult<string, number>;
    /**
     * the inverse of this SquareMatrix
     */
    inverse(): FineResult<string, ISquareMatrix>;
}
