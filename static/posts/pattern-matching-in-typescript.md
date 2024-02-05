---
title: Pattern Matching in TypeScript
date: 2/3/2024
tags:
  - typescript
  - c
  - haskell
  - rust
description: TODO
cover: cover.webp
coverAltText: TODO
---

## What is Pattern Matching?

"Pattern matching is the act of checking a given sequence of tokens for the
presence of the constituents of some pattern. In contrast to pattern
recognition, the match usually has to be exact: "either it will or will not be a
match."<sup> [source](https://en.wikipedia.org/wiki/Pattern_matching)</sup>

It is a fundamental concept in computer science, often a fundamental part of
functional programming syntax. Many modern programming languages have
first-class support for pattern matching. Once you understand pattern matching
you can use it to write code that is both clearer and safer than traditional
imperative programming techniques.

### Pitfalls of Imperative Programming Techniques

To understand why pattern matching is needed, let's start with a simple example
in C. Here's the problem: let's say you need a function that takes an array of
structs representing shapes and returns the sum of all the shapes areas.

We can create some types to represent our shapes like this:

```c
// An enum for identifying the type of a shape
typedef enum {
  CIRCLE,
  RECTANGLE,
  TRIANGLE,
} ShapeType;

// Allows us to hold different kinds of shapes the same memory location
typedef union {
  struct { double radius; }; // Circle
  struct { double width; double height; }; // Rectangle
  struct { double triA; double triB; double triC; }; // Triangle
} Dimensions;

// A box containing a shape with its members and a type field indicating
// what kind of shape we're dealing with
typedef struct {
  ShapeType type;
  Dimensions dimensions;
} Shape;
```

Now let's write the function using standard if/else statements:

```c
#include <math.h>

#define PI 3.14159265358979323846

double sum_areas(Shape shapes[], size_t size) {
  double area = 0;
  for (size_t i = 0; i < size; i++) {
    Shape shape = shapes[i];
    Dimensions ds = shape.dimensions;
    if (shape.type == CIRCLE) {
      area += (PI * ds.radius * ds.radius);
    } else if (shape.type == RECTANGLE) {
      area += (ds.width * ds.height);
    } else {
      double s = (ds.triA + ds.triB + ds.triC) / 2;
      area += sqrt(s * (s - ds.triA) * (s - ds.triB) * (s - ds.triC));
    }
  }
  return area;
}
```

We can also write a short program to test out our function:

```c
#include <stdio.h>

int main() {
  size_t size = 3;
  Shape shapes[size];
  
  // Define the shapes

  // Area should be PI
  shapes[0].type = CIRCLE;
  shapes[0].dimensions.radius = 1.0;

  // Area should be 6.0
  shapes[1].type = RECTANGLE;
  shapes[1].dimensions.width = 2.0;
  shapes[1].dimensions.height = 3.0;

  // Area should be 6.0
  shapes[2].type = TRIANGLE;
  shapes[2].dimensions.triA = 3.0;
  shapes[2].dimensions.triB = 4.0;
  shapes[2].dimensions.triC = 5.0;

  double totalArea = sum_areas(shapes, size);

  // Total area should be PI + 6.0 + 6.0 = 15.14...
  printf("Total area: %f\n", totalArea);

  return 0;
}
```

When we compile and run our program, the output is as expected:

```bash
$ gcc shapes.c -o shapes -lm
$ ./shapes
Total area: 15.141593
```

Now let's modify our types and array of shapes to include a new kind of shape:

```c
// ...

typedef enum {
  CIRCLE,
  RECTANGLE,
  TRIANGLE,
  PARALLELOGRAM,
} ShapeType;

typedef union {
  struct { double radius; }; // Circle
  struct { double width; double height; }; // Rectangle
  struct { double triA; double triB; double triC; }; // Triangle
  struct { double paraA; double paraB; double theta; }; // Parallelogram
} Dimensions;

// ...

int main() {
  size_t size = 3;
  Shape shapes[size];
  
  // Define the shapes

  // Area should be PI
  shapes[0].type = CIRCLE;
  shapes[0].dimensions.radius = 1.0;

  // Area should be 6.0
  shapes[1].type = RECTANGLE;
  shapes[1].dimensions.width = 2.0;
  shapes[1].dimensions.height = 3.0;

  // Area should be 6.0
  shapes[2].type = TRIANGLE;
  shapes[2].dimensions.triA = 3.0;
  shapes[2].dimensions.triB = 4.0;
  shapes[2].dimensions.triC = 5.0;

  // Area should be 6.0
  shapes[3].type = PARALLELOGRAM;
  shapes[3].dimensions.paraA = 2.0;
  shapes[3].dimensions.paraB = 3.0;
  shapes[3].dimensions.theta = PI / 2;

  double totalArea = sum_areas(shapes, size);

  // Total area should be PI + 6.0 + 6.0 + 6.0 = 21.14...
  printf("Total area: %f\n", totalArea);

  return 0;
}
```

We can compile and run our program:

```bash
$ gcc shapes.c -o shapes -lm
$ ./shapes
Total area: 16.579133
```

Wait, that's not right... It should have printed 21.14... What's going on here?
There weren't any compile errors, everything should be fine right?

Wrong. The C compiler will compile this without complaint. It will even run the
program for you without throwing any kind of errors or even seg faulting! What's
happening here is the worst kind of bug. There's no indication of what's going
wrong and where it's going wrong.

The problem is that we forgot to include a branch to calculate the area of a
parallelogram in `sum_areas()`. The parallelogram is being treated as if it is a
triangle. But wouldn't that cause an error when the triangle dimensions are
read?

Nope! We can modify the code to print the triangle dimensions:

```c
double sum_areas(Shape shapes[], size_t size) {
  double area = 0;
  for (size_t i = 0; i < size; i++) {
    Shape shape = shapes[i];
    Dimensions ds = shape.dimensions;
    if (shape.type == CIRCLE) {
      area += (PI * ds.radius * ds.radius);
    } else if (shape.type == RECTANGLE) {
      area += (ds.width * ds.height);
    } else {
      printf("triA: %f\n", ds.triA);
      printf("triB: %f\n", ds.triB);
      printf("triC: %f\n", ds.triC);
      double s = (ds.triA + ds.triB + ds.triC) / 2;
      area += sqrt(s * (s - ds.triA) * (s - ds.triB) * (s - ds.triC));
    }
  }
  return area;
}
```

And we can run the program again:

```bash
$ gcc shapes.c -o shapes -lm
$ ./shapes
triA: 3.000000
triB: 4.000000
triC: 5.000000
triA: 2.000000
triB: 3.000000
triC: 1.570796
Total area: 16.579133
```

😮

The compiler is using our parallelogram dimensions as if they were triangle
dimensions! What's happening is that the data for each object is stored in a
contiguous memory block and when a dimension is read on a shape, the compiler
just looks at the position in memory that the data should be in.

In a large code base, this kind of problem can take ages to discover and hours
to debug. If you're not careful and you don't test your code adequately, this
problem could easily go unnoticed and be released, only to be discovered much
later on.

There's another problem, let's say our program needs to support many more
shapes. The `if`/`else if`/`else` syntax can become a mess to read and maintain:

```c
double sum_areas(Shape shapes[], size_t size) {
  double area = 0;
  for (size_t i = 0; i < size; i++) {
    Shape shape = shapes[i];
    Dimensions ds = shape.dimensions;
    if (shape.type == CIRCLE) {
      area += (PI * ds.radius * ds.radius);
    } else if (shape.type == RECTANGLE) {
      area += (ds.width * ds.height);
    } else if (shape.type == TRIANGLE) {
      double s = (ds.triA + ds.triB + ds.triC) / 2;
      area += sqrt(s * (s - ds.triA) * (s - ds.triB) * (s - ds.triC));
    } else if (shape.type == ...) {
      ...
    } else if (shape.type == ...) {
      ...
    } else if (shape.type == ...) {
      ...
    } else if (shape.type == ...) {
      ...
    } else if (shape.type == ...) {
      ...
    } else if (shape.type == ...) {
      ...
    } else {
      ...
    }
  }
  return area;
}
```

C does offer a different syntax for this situation called `switch`/`case`:

```c
double sum_areas(Shape shapes[], size_t size) {
  double area = 0;
  for (size_t i = 0; i < size; i++) {
    Shape shape = shapes[i];
    Dimensions ds = shape.dimensions;
    switch (shape.type) {
      case CIRCLE:
        area += (PI * ds.radius * ds.radius);
        break;
      case RECTANGLE:
        area += (ds.width * ds.height);
        break;
      case TRIANGLE:
        double s = (ds.triA + ds.triB + ds.triC) / 2;
        area += sqrt(s * (s - ds.triA) * (s - ds.triB) * (s - ds.triC));
        break;
      case PARALLELOGRAM:
        // ...
        break;
      default:
        // Maybe exit with an error here? That could help us catch the
        // problem when it happens, but compile time errors are much
        // preferred over runtime errors.
    }
  }
  return area;
}
```

Although this may be slightly easier to read, I'd argue that it doesn't solve
any of the problems we're dealing with. It gives you another way to shoot
yourself in the foot: If you or someone else forgets to add the necessary break
statement, then the calculations may be incorrect again, leading to another
difficult-to-debug problem. So now, in each place in your code where you may be
processing shapes like this, you have to remember to add handlers when new
shapes are added and always remember to add break statements.

We need something better!

## First-class Pattern Matching

### Haskell

Pattern matching is how you define functions in Haskell. I believe this is one
of the main reasons why people struggle with understanding Haskell, especially
people who have only used imperative programming.

```haskell
fib :: Int -> Int
fib 0 = 0
fib 1 = 1
fib n = fib (n - 1) + fib (n - 2)
```

### Rust

Rust offers a happy medium

https://doc.rust-lang.org/rust-by-example/flow_control/match.html

```rust
fn fib(n: u64) -> u64 {
  match n {
    0 => 0,
    1 => 1,
    _ => fib(n - 1) + fib(n - 2),
  }
}
```

### -

## Options in TypeScript

### `switch` / `case`

### A Simple Implementation

```typescript
type CompletePattern<O extends PropertyKey> = { [key in O]: () => unknown };

type PartialPattern<O extends PropertyKey> = Partial<CompletePattern<O>> & {
  _: () => unknown;
};

const match = <
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
```

```typescript
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

const matchObj = <
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
```

### Other Userland Options

### Performance Comparison

### TC39 Proposal

https://github.com/tc39/proposal-pattern-matching

## Conclusion?
