---
title: Pattern Matching
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

## What is pattern matching and why do I need it?

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
in C. Let's say you need a function that takes an array of structs representing
shapes and returns the sum of all the shapes' areas.

We can create some types to represent our shapes like this:

```c
// An enum for identifying the type of a shape
typedef enum {
  CIRCLE,
  RECTANGLE,
  triangle,
} ShapeType;

// Allows us to hold different shapes in the same memory location
typedef union {
  struct { double radius; }; // a circle
  struct { double width; double height; }; // a rectangle
  struct { double sideA; double sideB; double sideC; }; // a triangle
} Dimensions;

// A box containing a shape with its members and a type field indicating
// what kind of shape we're dealing with
typedef struct {
  ShapeType type;
  Dimensions dimensions;
} Shape;
```

Now let's write the function using standard `if`/`else` statements:

```c
#include <math.h>

// ...

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
      double s = (ds.sideA + ds.sideB + ds.sideC) / 2;
      area += sqrt(s * (s - ds.sideA) * (s - ds.sideB) * (s - ds.sideC));
    }
  }
  return area;
}
```

We can also write a short program to test out our function:

```c
#include <stdio.h>

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
  shapes[2].type = triangle;
  shapes[2].dimensions.sideA = 3.0;
  shapes[2].dimensions.sideB = 4.0;
  shapes[2].dimensions.sideC = 5.0;

  double totalArea = sum_areas(shapes, size);

  // Total area should be PI + 6.0 + 6.0 = 15.14...
  printf("Total area: %f\n", totalArea);

  return 0;
}
```

When we compile and run our program, the output is as expected:

```text
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
  triangle,
  PARALLELOGRAM,
} ShapeType;

typedef union {
  struct { double radius; }; // a circle
  struct { double width; double height; }; // a rectangle
  struct { double sideA; double sideB; double sideC; }; // a triangle
  struct { double paraA; double paraB; double theta; }; // a parallelogram
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
  shapes[2].type = triangle;
  shapes[2].dimensions.sideA = 3.0;
  shapes[2].dimensions.sideB = 4.0;
  shapes[2].dimensions.sideC = 5.0;

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

```text
$ gcc shapes.c -o shapes -lm
$ ./shapes
Total area: 16.579133
```

Wait, that's not right... It should have printed 21.14... What's going on here?
There weren't any compile errors, everything should be fine right?

Wrong. The C compiler will compile this without complaint. It will even run the
program for you without throwing an error or
[seg faulting](https://en.wikipedia.org/wiki/Segmentation_fault)! What's
happening here is the worst kind of bug. Aside from manual validation, there's
no indication that there is anything wrong.

The problem is that we forgot to include a branch to calculate the area of a
parallelogram in `sum_areas()`. The parallelogram is being treated as if it were
a triangle.

Let's modify the code to get a closer look:

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
      printf("sideA: %f\n", ds.sideA);
      printf("sideB: %f\n", ds.sideB);
      printf("sideC: %f\n", ds.sideC);
      double s = (ds.sideA + ds.sideB + ds.sideC) / 2;
      area += sqrt(s * (s - ds.sideA) * (s - ds.sideB) * (s - ds.sideC));
    }
  }
  return area;
}
```

And we can run the program again:

```text
$ gcc shapes.c -o shapes -lm
$ ./shapes
sideA: 3.000000
sideB: 4.000000
sideC: 5.000000
sideA: 2.000000
sideB: 3.000000
sideC: 1.570796
Total area: 16.579133
```

😮 The compiler is using our parallelogram dimensions as if they were triangle
dimensions!

What's happening is that the data for each object is stored in a contiguous
memory block and when a dimension is read on a shape, the compiler just looks at
the position in memory that the data should be in.

In a large code base, this kind of problem can take ages to discover and hours
to debug. If you're not careful and you don't test your code adequately, this
problem could easily go unnoticed and be released, only to be discovered much
later on.

We could modify the function so that the final else branch exits the program if
it's ever reached:

```c
#include <stdlib.h> // Need to include to use exit()

// ...

double sum_areas(Shape shapes[], size_t size) {
  double area = 0;
  for (size_t i = 0; i < size; i++) {
    Shape shape = shapes[i];
    Dimensions ds = shape.dimensions;
    if (shape.type == CIRCLE) {
      area += (PI * ds.radius * ds.radius);
    } else if (shape.type == RECTANGLE) {
      area += (ds.width * ds.height);
    } else if (shape.type == triangle) {
      double s = (ds.sideA + ds.sideB + ds.sideC) / 2;
      area += sqrt(s * (s - ds.sideA) * (s - ds.sideB) * (s - ds.sideC));
    } else {
      printf("Missing sum handler for shape with type: %d\n", shape.type);
      exit(1);
    }
  }
  return area;
}

// ...
```

But this is just a band-aid solution for our still-bleeding wound. Throwing or
exiting with an error at runtime like this should be avoided. It can lead to
system instability and can still be difficult to debug as the errors may only
occur under certain conditions. Fixing the problem later in the development
cycle can be more expensive as it may require additional deployments and
validation. Ideally, this kind of problem should be caught as early as possible.

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
    } else if (shape.type == triangle) {
      double s = (ds.sideA + ds.sideB + ds.sideC) / 2;
      area += sqrt(s * (s - ds.sideA) * (s - ds.sideB) * (s - ds.sideC));
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

C does offer a different syntax for this situation called `switch`/`case` which
may be slightly easier to read:

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
      case triangle:
        double s = (ds.sideA + ds.sideB + ds.sideC) / 2;
        area += sqrt(s * (s - ds.sideA) * (s - ds.sideB) * (s - ds.sideC));
        break;
      case PARALLELOGRAM:
        // ...
        break;
      default: // This corresponds to the final else
        // ...
    }
  }
  return area;
}
```

However, I'd argue that it doesn't solve any of the problems we're dealing with.
It gives you another way to shoot yourself in the foot: If you or someone else
forgets to add the necessary break statement, then the calculations may be
incorrect again, leading to another difficult-to-debug problem. So now, in each
place in your code where you may be processing shapes like this, you have to
remember to add handlers when new shapes are added and always remember to add
break statements.

These problems aren't just limited to C.
[Languages that descend from C](https://en.wikipedia.org/wiki/List_of_C-family_programming_languages)
tend to inherit its syntax and imperative programming style, including
`if`/`else` and `switch`/`case`.

## First-class Pattern Matching

As stated earlier, many modern programming languages have support for pattern
matching. The checks we're looking for can be done at compile time rather than
runtime. You should check if your favorite programming language has support for
pattern matching so that you can avoid the pitfalls discussed above.

### Haskell

Let's start with Haskell, one of the most influential and "pure" functional
programming languages.

Pattern matching is how you define functions in Haskell. I believe this is one
of the main reasons why people struggle with understanding Haskell, especially
people who have only used imperative programming.

Here's a simple (unoptimized) example of a function for calculating the nth
[Fibonacci](https://en.wikipedia.org/wiki/Fibonacci_sequence) number:

```haskell
fib 0 = 0
fib 1 = 1
fib n = fib (n - 1) + fib (n - 2)
```

When `0` is passed to `fib`, it returns `0`. When `1` is passed to `fib` it
returns `1`. When any other number is passed, it returns the sum of the previous
two Fibonacci numbers recursively.

Simple and elegant.

Now let's take a look at the previous problem we were dealing with. First let's
write the code for calculating the sum of the areas of circles, rectangles, and
triangles:

```haskell
module Main where

data Shape
  = Circle Float -- radius
  | Rectangle Float Float -- width, height
  | Triangle Float Float Float -- side a, side b, side c

sumArea [] = 0
sumArea (Circle r : shapes) = (pi * (r ** 2)) + sumArea shapes
sumArea (Rectangle w h : shapes) = (w * h) + sumArea shapes
sumArea (Triangle a b c : shapes) = sqrt (s * (s - a) * (s - b) * (s - c)) + sumArea shapes
  where
    s = (a + b + c) / 2

shapes =
  [ Circle 1.0,
    Rectangle 2.0 3.0,
    Triangle 3.0 4.0 5.0
  ]

main = do
  print (sumArea shapes)
```

Also pretty short and sweet! You can see we have a data type called `Shape` with
three different variants and corresponding dimensions. We also have a function
called sumArea that takes a list of `Shape`s and calculates the sum using
destructuring and recursion. Lastly, we have a main function, just like in C,
that prints the total area.

All without a single `if`/`else` or `switch`/`case` in sight. 😎

If we compile and run our program, the output is as expected:

```text
$ ghc shape.hs
[1 of 2] Compiling Main      ( shape.hs, shape.o ) [Source file changed]
[2 of 2] Linking shape [Objects changed]
$ ./shape
15.141593
```

Nice.

Let's try and add a new `Shape` just like before:

```haskell
-- ...

data Shape
  = Circle Float -- radius
  | Rectangle Float Float -- width, height
  | Triangle Float Float Float -- side a, side b, side c
  | Parallelogram Float Float Float -- sida a, side b, theta

-- ...

shapes =
  [ Circle 1.0,
    Rectangle 2.0 3.0,
    Triangle 3.0 4.0 5.0,
    Parallelogram 2.0 3.0 (pi / 2)
  ]

-- ...
```

And now if we compile our program:

```text
$ ghc shape.hs
[1 of 2] Compiling Main      ( shape.hs, shape.o ) [Source file changed]
[2 of 2] Linking shape [Objects changed]
```

... wait, wasn't the compiler supposed to help us somehow?

Let's try running it anyway:

```text
$ ./shape
shape: shape.hs:(12,1)-(17,23): Non-exhaustive patterns in function sumArea
```

Huh. Well, at least it told us what's wrong and where it's wrong. But shouldn't
this happen at compile time?

It turns out that to enable the compile time check that we're looking for, we
have to enable the `-fwarn-incomplete-patterns` compiler flag. You can add it
directly to the code like this:

```haskell
{-# OPTIONS_GHC -fwarn-incomplete-patterns #-}

-- ... the rest of the code
```

And now when we compile the code we get this:

```text
$ ghc shape.hs
[1 of 2] Compiling Main      ( shape.hs, shape.o ) [Source file changed]

shape.hs:12:1: warning: [-Wincomplete-patterns]
    Pattern match(es) are non-exhaustive
    In an equation for ‘sumArea’:
        Patterns of type ‘[Shape]’ not matched: ((Parallelogram _ _ _):_)
   |
12 | sumArea [] = 0
   | ^^^^^^^^^^^^^^...
[2 of 2] Linking shape [Objects changed]
```

But there's another caveat: it still compiled the program! If this were to run
in a CI environment, then the compilation step would still pass and we'd be none
the wiser.

To make this problem fail during compilation, we have to enable another flag
like this:

```haskell
{-# OPTIONS_GHC -Werror #-}
{-# OPTIONS_GHC -fwarn-incomplete-patterns #-}

-- ... the rest of the code
```

Now when we compile it fails at the compile step:

```text
$ ghc shape.hs
[1 of 2] Compiling Main      ( shape.hs, shape.o ) [Source file changed]

shape.hs:13:1: error: [-Wincomplete-patterns, -Werror=incomplete-patterns]
    Pattern match(es) are non-exhaustive
    In an equation for ‘sumArea’:
        Patterns of type ‘[Shape]’ not matched: ((Parallelogram _ _ _):_)
   |
13 | sumArea [] = 0
   | ^^^^^^^^^^^^^^...
```

Not ideal. But at least we have the option. Haskell has been around since 1990,
this is probably just a result of not wanting to introduce a breaking behavior
into the compiler.

There have been many new languages introduced since then, including some with
exhaustiveness checks enabled by default!

### Rust

This brings us to Rust! Its syntax is more of a happy medium between imperative
programming and functional programming. It should be easier to read for
imperative-brained developers while also offering the purity of functional
programming. 😁

First, let's dip our toes in with the Fibonacci example from before:

```rust
fn fib(n: u64) -> u64 {
  match n {
    0 => 0,
    1 => 1,
    _ => fib(n - 1) + fib(n - 2),
  }
}
```

This function works just like it did in Haskell: When `n` is `0`, `fib` returns
`0`. When `n` is `1`, `fib` returns `1`. When `n` is any other number, `fib`
returns the sum of the two preceding Fibonacci numbers.

If you'd like to read more about the match keyword, check out the Rust docs here
https://doc.rust-lang.org/rust-by-example/flow_control/match.html.

Now let's jump right in and move on to the shapes example:

```rust
use std::f64::consts::PI;

struct Circle {
  r: f64,
}

struct Rectangle {
  w: f64,
  h: f64,
}

struct Triangle {
  a: f64,
  b: f64,
  c: f64,
}

enum Shape {
  Circle(Circle),
  Rectangle(Rectangle),
  Triangle(Triangle),
}

fn sum_area(shapes: &[Shape]) -> f64 {
  match shapes {
    [] => 0.0,
    [Shape::Circle(Circle { r }), tail @ ..] => (PI * r * r) + sum_area(tail),
    [Shape::Rectangle(Rectangle { w, h }), tail @ ..] => (w * h) + sum_area(tail),
    [Shape::Triangle(Triangle { a, b, c }), tail @ ..] => {
      let s = (a + b + c) / 2.0;
      f64::sqrt(s * (s - a) * (s - b) * (s - c)) + sum_area(tail)
    }
  }
}

fn main() {
  let shapes = [
    Shape::Circle(Circle { r: 1.0 }),
    Shape::Rectangle(Rectangle { w: 2.0, h: 2.0 }),
    Shape::Triangle(Triangle {
      a: 3.0,
      b: 4.0,
      c: 5.0,
    }),
  ];
  println!("{}", sum_area(&shapes))
}
```

We have a few structs representing our shapes, an enum that allows us to store
shapes in the same location, a function for calculating the total area of all
the shapes, and a main function for testing it out.

Looks pretty good! It's a little bit more verbose, and `tail @ ..` looks a
little weird, but it works!

Let's compile and run it now:

```text
$ cargo run
   Compiling website v0.1.0 (/workspaces/website)
    Finished dev [unoptimized + debuginfo] target(s) in 5.20s
     Running `target/debug/website`
13.141592653589793
```

Looking good so far!

Now let's try adding another shape:

```rust
// ...

struct Parallelogram {
  a: f64,
  b: f64,
  t: f64,
}

enum Shape {
  Circle(Circle),
  Rectangle(Rectangle),
  Triangle(Triangle),
  Parallelogram(Parallelogram),
}

// ...
```

Now if we try to compile and run it:

```text
$ cargo run
   Compiling website v0.1.0 (/workspaces/website)
error[E0004]: non-exhaustive patterns: `&[Shape::Parallelogram(_), ..]`
not covered
  --> src/main.rs:32:9
   |
32 |   match shapes {
   |         ^^^^^^ pattern `&[Shape::Parallelogram(_), ..]` not covered
   |
   = note: the matched value is of type `&[Shape]`
help: ensure that all possible cases are being handled by adding a match
arm with a wildcard pattern or an explicit pattern as shown
   |
39 ~     },
40 +     &[Shape::Parallelogram(_), ..] => todo!()
   |

For more information about this error, try `rustc --explain E0004`.
error: could not compile `website` (bin "website") due to previous error
```

Excellent! Not only did we get an error, but it was fatal, and it explained
exactly what we need to do to fix it. Very nice.

Maybe now you can understand some of the reasons why Rust is so difficult is
that its syntax is a little weird and it has an entire set of checks that other
compilers don't do.

## What about TypeScript?

Unfortunately, TypeScript doesn't come with first-class support for pattern
matching out of the box. There are, however, a few ways we can get it to do what
we want:

### `switch` / `case`

We can use a switch statement with a utility function that ensures that all
options have been covered:

```typescript
const assertNever = (_: never) => {
  throw new Error("This should never actually get thrown.");
};

type Circle = { type: "circle"; r: number };

type Rectangle = { type: "rectangle"; w: number; h: number };

type Triangle = { type: "triangle"; a: number; b: number; c: number };

type Shape =
  | Circle
  | Rectangle
  | Triangle;

const sumAreas = (shapes: Shape[]) => {
  let area = 0;
  for (const shape of shapes) {
    switch (shape.type) {
      case "circle":
        area += Math.PI * shape.r * shape.r;
        break;
      case "rectangle":
        area += shape.w * shape.h;
        break;
      case "triangle": {
        const s = (shape.a + shape.b + shape.c) / 2;
        area += Math.sqrt(s * (s - shape.a) * (s - shape.b) * (s - shape.c));
        break;
      }
      default:
        assertNever(shape);
    }
  }
  return area;
};
```

The compiler with properly infer the types of `shape` within each case
statement, and if another variant is added to `Shape`, then we'll get a compile
time error via `assertNever()`:

```typescript
// ...

type Parallelogram = { type: "parallelogram"; a: number; b: number; t: number };

type Shape =
  | Circle
  | Rectangle
  | Triangle
  | Parallelogram;

// ...
```

```text
$ deno check test.ts
Check file:///workspaces/website/test.ts
error: TS2345 [ERROR]: Argument of type 'Parallelogram' is not assignable to parameter of type 'never'.
        assertNever(shape);
                    ~~~~~
    at file:///workspaces/website/test.ts:35:21
```

While not quite as helpful as the error in Rust, this at least tells us that it
has something to do with a Parallelogram and ensures that there is a case for
every shape type.

### TS-Pattern

My preferred option is to use
[`ts-pattern`](https://www.npmjs.com/package/ts-pattern). It allows you to match
on the structure and type of a variable in a much more nuanced way than a with a
basic `switch`/`case`.

Here's the re-written shapes example:

```typescript
import { match } from "npm:ts-pattern";

type Circle = { type: "circle"; r: number };

type Rectangle = { type: "rectangle"; w: number; h: number };

type Triangle = { type: "triangle"; a: number; b: number; c: number };

type Shape =
  | Circle
  | Rectangle
  | Triangle;

const sumAreas = (shapes: Shape[]) => {
  let area = 0;
  for (const shape of shapes) {
    area += match(shape)
      .with({ type: "circle" }, ({ r }) => Math.PI * r * r)
      .with({ type: "rectangle" }, ({ w, h }) => w * h)
      .with({ type: "triangle" }, ({ a, b, c }) => {
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
      })
      .exhaustive();
  }
  return area;
};
```

Nice and concise!

And now if we add another Shape variant:

```typescript
// ...

type Parallelogram = { type: "parallelogram"; a: number; b: number; t: number };

type Shape =
  | Circle
  | Rectangle
  | Triangle
  | Parallelogram;

// ...
```

```text
$ deno check test.ts
Check file:///workspaces/website/test.ts
error: TS2349 [ERROR]: This expression is not callable.
  Type 'NonExhaustiveError<Parallelogram>' has no call signatures.
      .exhaustive();
       ~~~~~~~~~~
    at file:///workspaces/website/test.ts:27:8
```

While this is not super helpful, the tooltip for `.exhaustive()` gives a clear
explanation:

```text
.exhaustive() checks that all cases are handled, and returns the result
value.

If you get a NonExhaustiveError, it means that you aren't handling all
cases. You should probably add another .with(...) clause to match the
missing case and prevent runtime errors.
```

`ts-pattern` supports a bunch of different ways to match and also comes with a
few other useful utilities. Be sure to check out the
[docs](https://github.com/gvergnaud/ts-pattern?tab=readme-ov-file#documentation)!

<!-- ### A Simple Implementation

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
``` -->

### TC39 Proposal

https://github.com/tc39/proposal-pattern-matching

## Conclusion

Hopefully, through these examples, you've gained some insight into each of the
languages I went over, and why I feel exhaustive pattern matching is
~~important~~ absolutely necessary to program quickly and effectively today.
