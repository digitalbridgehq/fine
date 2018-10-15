export class ZeroArray extends Array {
    constructor(len: number) {
        super(len);
        for (let i = 0; i < len; i++) {
            this[i] = 0;
        }
    }
}
