// https://github.com/microsoft/TypeScript/pull/29955#issuecomment-470062531
export function removeNullable<T>(
  value: T
): value is Exclude<T, false | null | undefined | '' | 0> {
  return Boolean(value)
}

export type NestedNonNullable<T> = {
  [P in keyof T]: NestedNonNullable<NonNullable<T[P]>>
}
