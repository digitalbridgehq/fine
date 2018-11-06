import { Either } from 'fp-ts/lib/Either';

export type FineResult<T extends string, U> = Either<T, U>;