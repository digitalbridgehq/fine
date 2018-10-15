import { Either } from 'fp-ts/lib/Either';

// TODO: add index.ts
export interface ISum<T> {
    /**
     * produce a sum of the left and right operands
     */
    sum: (right: T) => Either<string, T>;
}
