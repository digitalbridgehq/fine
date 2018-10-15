export class Range extends Array {
    constructor(from: number, to: number) {
        super(0);
        for (let i = 0; i <= to - from; i++) {
            this.push(from + i);
        }
    }
}
