import { SquareMatrix } from './SquareMatrix';

export class SquareMatrix3D extends SquareMatrix {
    public static identity(): SquareMatrix3D {
        // prettier-ignore
        return new SquareMatrix3D([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }
    constructor(initialContents: Array<number> = []) {
        super(3, initialContents);
    }
}
