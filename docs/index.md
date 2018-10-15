# fine

The following objects are exposed at the top level:

- `Position3D`
- `Vector`
- `Matrix`
- `SquareMatrix`
- `SquareMatrix3D`
- `AxisAlignedBoundingBox`
- `AffineTransform`
- `OrientedBoundingBox`

## Error Handling

Methods which could fail return an `Either` from [fp-ts](https://github.com/gcanti/fp-ts/blob/master/docs/Either.md), rather than throwing an error. This ensures the developer handles an error, rather than letting it bubble up by accident. When a method returns a failiure with a `Left`, it should contain a descriptive string with the problem. These are all kept as static members of the class the error comes from, in all caps and starting with `ERR_` for the purpose of matching against specific errors. 