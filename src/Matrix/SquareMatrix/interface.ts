import { Either } from 'fp-ts/lib/Either';
import { IMatrix } from '../interface';

export interface ISquareMatrix extends IMatrix {
    /**
     * the determinant of this SquareMatrix
     */
    determinant(): Either<string, number>;
    /**
     * the inverse of this SquareMatrix
     */
    inverse(): Either<string, ISquareMatrix>;
}
