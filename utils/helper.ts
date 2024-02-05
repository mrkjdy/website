export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

type CompletePattern<O extends PropertyKey> = { [key in O]: () => unknown };

type PartialPattern<O extends PropertyKey> = Partial<CompletePattern<O>> & {
  _: () => unknown;
};

export const match = <
  O extends PropertyKey,
  P extends CompletePattern<O> | PartialPattern<O>,
>(
  option: O,
  pattern: P,
) =>
  (pattern[option] ?? (pattern as PartialPattern<O>)._)() as P extends
    { [Key in O]: () => infer R } ? R
    : P extends { [Key in O]?: () => infer R } & { _: () => infer D } ? R | D
    : never;

type TypeRecord<T, Opt extends PropertyKey> = T & Record<"type", Opt>;

type CompleteObjectPattern<
  T,
  Opt extends PropertyKey,
  Obj extends TypeRecord<T, Opt>,
> = {
  [Key in Obj["type"]]: Obj extends TypeRecord<T, Key> ? (obj: Obj) => unknown
    : never;
};

type PartialObjectPattern<
  T,
  Opt extends PropertyKey,
  Obj extends TypeRecord<T, Opt>,
> =
  & Partial<
    CompleteObjectPattern<T, Opt, Obj>
  >
  & { _: (obj: Obj) => unknown };

export const matchObj = <
  T,
  Opt extends PropertyKey,
  Obj extends TypeRecord<T, Opt>,
  P extends
    | CompleteObjectPattern<T, Opt, Obj>
    | PartialObjectPattern<T, Opt, Obj>,
>(
  obj: Obj,
  pattern: P,
) =>
  (pattern[obj.type] ?? (pattern as PartialObjectPattern<T, Opt, Obj>)._)(
    // deno-lint-ignore no-explicit-any
    obj as any,
  ) as P extends {
    [Key in Obj["type"]]: Obj extends TypeRecord<T, Key> ? (obj: Obj) => infer R
      : never;
  } ? R
    : P extends
      & {
        [Key in Obj["type"]]?: Obj extends TypeRecord<T, Key>
          ? (obj: Obj) => infer R
          : never;
      }
      & { _: (obj: Obj) => infer D } ? R | D
    : never;
