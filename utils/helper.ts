export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

type CompletePattern<O extends PropertyKey> = { [Key in O]: () => unknown };

type PartialPattern<O extends PropertyKey> = Partial<CompletePattern<O>> & {
  _: () => unknown;
};

export const match = <
  O extends PropertyKey,
  P extends CompletePattern<O> | PartialPattern<O>,
>(option: O, pattern: P) =>
  (pattern[option] ?? (pattern as PartialPattern<O>)._)() as P extends
    { [Key in O]: () => infer R } ? R
    : P extends { [Key in O]?: () => infer R } & { _: () => infer D } ? R & D
    : never;
