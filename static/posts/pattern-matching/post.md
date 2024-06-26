---
title: Pattern Matching
date: 3/26/2024
tags:
  - programming
  - typescript
  - c
  - haskell
  - rust
description: |
  An overview of Pattern Matching, with demos of why it's needed, and how you
  can use it to write cleaner and safer code
cover:
  alt: An AI-generated picture of a shape sorter toy
  caption: |
    Note: Although this image is AI generated, the rest of this post is written
    by me. (a human)
---

## What is pattern matching?

Pattern matching is a technique in programming that involves matching a value
against a set of patterns to determine which branch or arm to execute. It is a
fundamental concept in computer science and often is a core part of functional
programming syntax. It's expressive, often enabling you to match on the
structure of some data while
[destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
it at the same time. Once you understand pattern matching, you can use it to
write code that is both clearer and safer than traditional imperative
programming techniques.

### Pitfalls of Imperative Programming Techniques

To understand why pattern matching is needed, let's start with a simple example
in C. Let's say you need a function that takes a shape and returns the area of
the shape depending on its type.

We can create a few types to represent our shapes like this:

```c
// An enum for identifying the type of a shape
typedef enum {
  CIRCLE,
  RECTANGLE,
  TRIANGLE
} ShapeType;

// Allows us to hold different kinds of shapes in the same memory
// location
typedef union {
  struct { double r; }; // a circle
  struct { double w; double h; }; // a rectangle
  struct { double a; double b; double c; }; // a triangle
} Dimensions;

// A box containing a shape with its members and a type field indicating
// what kind of shape we're dealing with
typedef struct {
  ShapeType type;
  Dimensions dimensions;
} Shape;
```

Now let's write a function to calculate the area of a given shape:

```c
#include <math.h>

// ...

double shape_area(Shape shape) {
  Dimensions ds = shape.dimensions;
  if (shape.type == CIRCLE) {
    return M_PI * ds.r * ds.r;
  } else if (shape.type == RECTANGLE) {
    return ds.w * ds.h;
  } else {
    double s = (ds.a + ds.b + ds.c) / 2;
    return sqrt(s * (s - ds.a) * (s - ds.b) * (s - ds.c));
  }
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

  // Area should be pi
  shapes[0].type = CIRCLE;
  shapes[0].dimensions.r = 1.0;

  // Area should be 6.0
  shapes[1].type = RECTANGLE;
  shapes[1].dimensions.w = 2.0;
  shapes[1].dimensions.h = 3.0;

  // Area should be 6.0
  shapes[2].type = TRIANGLE;
  shapes[2].dimensions.a = 3.0;
  shapes[2].dimensions.b = 4.0;
  shapes[2].dimensions.c = 5.0;

  double totalArea = 0;
  for (size_t i = 0; i < size; i++) {
    totalArea += shape_area(shapes[i]);
  }

  // Total area should be pi + 6.0 + 6.0 = 15.14...
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
  struct { double r; }; // a circle
  struct { double w; double h; }; // a rectangle
  struct { double a; double b; double c; }; // a triangle
  struct { double x; double y; double t; }; // a parallelogram
} Dimensions;

// ...

int main() {
  size_t size = 3;
  Shape shapes[size];

  // Define the shapes

  // Area should be pi
  shapes[0].type = CIRCLE;
  shapes[0].dimensions.r = 1.0;

  // Area should be 6.0
  shapes[1].type = RECTANGLE;
  shapes[1].dimensions.w = 2.0;
  shapes[1].dimensions.h = 3.0;

  // Area should be 6.0
  shapes[2].type = triangle;
  shapes[2].dimensions.a = 3.0;
  shapes[2].dimensions.b = 4.0;
  shapes[2].dimensions.c = 5.0;

  // Area should be 6.0
  shapes[3].type = PARALLELOGRAM;
  shapes[3].dimensions.x = 2.0;
  shapes[3].dimensions.y = 3.0;
  shapes[3].dimensions.t = M_PI / 2;

  double totalArea = 0;
  for (size_t i = 0; i < size; i++) {
    totalArea += shape_area(shapes[i]);
  }

  // Total area should be pi + 6.0 + 6.0 + 6.0 = 21.14...
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
There weren't any compile errors, everything should be fine, right?

Wrong. The C compiler will compile this without complaint. It will even run the
program for you without throwing an error or
[segfaulting](https://en.wikipedia.org/wiki/Segmentation_fault)! This is the
worst kind of bug. Aside from manual validation, there's no indication that
there is anything wrong.

The problem is that we forgot to include a branch to calculate the area of a
parallelogram in `shape_area()`. The parallelogram is being treated as if it
were a triangle.

Let's modify the code to get a closer look:

```c
double shape_area(Shape shape) {
  Dimensions ds = shape.dimensions;
  if (shape.type == CIRCLE) {
    return M_PI * ds.r * ds.r;
  } else if (shape.type == RECTANGLE) {
    return ds.w * ds.h;
  } else {
    printf("a: %f\n", ds.a);
    printf("b: %f\n", ds.b);
    printf("c: %f\n", ds.c);
    double s = (ds.a + ds.b + ds.c) / 2;
    return sqrt(s * (s - ds.a) * (s - ds.b) * (s - ds.c));
  }
}
```

And we can run the program again:

```text
$ gcc shapes.c -o shapes -lm
$ ./shapes
a: 3.000000
b: 4.000000
c: 5.000000
a: 2.000000
b: 3.000000
c: 1.570796
Total area: 16.579133
```

😮 The compiler is using our parallelogram dimensions as if they were triangle
dimensions!

The data for each object is stored in a contiguous memory block and when a
dimension is read on a shape, the compiler just looks at the position in memory
that the data should be in.

In a large code base, this kind of problem can take ages to discover and hours
to debug. If you're not careful and you don't test your code adequately, this
problem could easily go unnoticed and be released, only to be discovered much
later on.

We could modify the function so that the final else branch exits the program if
it's ever reached:

```c
#include <stdlib.h> // Need to include to use exit()

// ...

double shape_area(Shape shape) {
  Dimensions ds = shape.dimensions;
  if (shape.type == CIRCLE) {
    return (M_PI * ds.r * ds.r);
  } else if (shape.type == RECTANGLE) {
    return (ds.w * ds.h);
  } else if (shape.type == TRIANGLE) {
    double s = (ds.a + ds.b + ds.c) / 2;
    return sqrt(s * (s - ds.a) * (s - ds.b) * (s - ds.c));
  } else {
    printf("Missing handler for shape with type: %d\n", shape.type);
    exit(1);
  }
}

// ...
```

But this is just a band-aid solution for our still-bleeding wound. Throwing or
exiting with an error at runtime like this should be avoided because it can lead
to system instability and can be difficult to debug as the errors may only occur
under certain conditions. Also, fixing the problem later in the development
cycle can be more expensive as it may require additional deployments and
validation. Ideally, this kind of problem should be caught as early as possible,
i. e. at compile time.

There's another problem, let's say our program needs to support many more
shapes. The `if`/`else if`/`else` syntax can become a mess to read and maintain:

```c
// ...

double shape_area(Shape shape) {
  Dimensions ds = shape.dimensions;
  if (shape.type == CIRCLE) {
    return M_PI * ds.r * ds.r;
  } else if (shape.type == RECTANGLE) {
    return ds.w * ds.h;
  } else if (shape.type == TRIANGLE) {
    double s = (ds.a + ds.b + ds.c) / 2;
    return sqrt(s * (s - ds.a) * (s - ds.b) * (s - ds.c));
  } else if (shape.type == ...) {
    return ...
  } else if (shape.type == ...) {
    return ...
  } else if (shape.type == ...) {
    return ...
  } else if (shape.type == ...) {
    return ...
  } else if (shape.type == ...) {
    return ...
  } else if (shape.type == ...) {
    return ...
  } else {
    printf("Missing handler for shape with type: %d\n", shape.type);
    exit(1);
  }
}

// ...
```

One way to improve the readability slightly is to just use `if` statements:

```c
// ...

double shape_area(Shape shape) {
  Dimensions ds = shape.dimensions;
  if (shape.type == CIRCLE) {
    return M_PI * ds.r * ds.r;
  }
  if (shape.type == RECTANGLE) {
    return ds.w * ds.h;
  }
  if (shape.type == TRIANGLE) {
    double s = (ds.a + ds.b + ds.c) / 2;
    return sqrt(s * (s - ds.a) * (s - ds.b) * (s - ds.c));
  }
  if (shape.type == ...) {
    return ...;
  }
  if (shape.type == ...) {
    return ...;
  }
  if (shape.type == ...) {
    return ...;
  }
  if (shape.type == ...) {
    return ...;
  }
  if (shape.type == ...) {
    return ...;
  }
  if (shape.type == ...) {
    return ...;
  }
  printf("Missing handler for shape with type: %d\n", shape.type);
  exit(1);
}

// ...
```

Another option is to use `switch`/`case` which may still be a bit easier to
read:

```c
// ...

double shape_area(Shape shape) {
  Dimensions ds = shape.dimensions;
  switch (shape.type) {
    case CIRCLE:
      return M_PI * ds.r * ds.r;
    case RECTANGLE:
      return ds.w * ds.h;
    case TRIANGLE:
      double s = (ds.a + ds.b + ds.c) / 2;
      return sqrt(s * (s - ds.a) * (s - ds.b) * (s - ds.c));
    case ...:
      return ...;
    default:
      printf("Missing handler for shape with type: %d\n", shape.type);
      exit(1);
  }
}

// ...
```

However, I'd argue that it doesn't solve the main problem we're dealing with,
and it gives you another way to shoot yourself in the foot. For example, if you
or someone else forgets to return or break in a case, then the calculations may
be incorrect again, leading to another difficult-to-debug problem. So now, in
each place where you may be processing shapes like this, you have to remember to
add handlers when new shapes are added and always remember to return or break.

These problems aren't just limited to C.
[Languages that descend from C](https://en.wikipedia.org/wiki/List_of_C-family_programming_languages)
tend to inherit its syntax and imperative programming style, including
`if`/`else` and `switch`/`case`.

## First-class Pattern Matching

As stated earlier, many modern programming languages have support for pattern
matching. The checks we're looking for can be done at compile time rather than
at runtime. You should check if your favorite programming language has support
for pattern matching so that you can avoid the pitfalls discussed above.

### Haskell

Let's start with Haskell, one of the most influential and "pure" functional
programming languages.

Pattern matching is how you define functions in Haskell. I believe this is one
of the main reasons why people struggle with understanding Haskell, especially
those who have only used imperative programming.

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

shapeArea (Circle r) = pi * (r ** 2)
shapeArea (Rectangle w h) = w * h
shapeArea (Triangle a b c) = sqrt (s * (s - a) * (s - b) * (s - c))
  where
    s = (a + b + c) / 2

shapes =
  [ Circle 1.0,
    Rectangle 2.0 3.0,
    Triangle 3.0 4.0 5.0
  ]

main = do
  print (sum (map shapeArea shapes))
```

Also pretty short and sweet! You can see we have a data type called `Shape` with
three different variants and corresponding dimensions. We also have a function
called shapeArea that takes a `Shape`, destructures its dimensions, and returns
its area. Lastly, we have a main function, just like in C, that prints the total
area.

All without a single `if`/`else` or `switch`/`case` in sight. 😎

If we compile and run our program, the output is as expected:

```text
$ ghc shape.hs
[1 of 2] Compiling Main      ( shape.hs, shape.o ) [Source file changed]
[2 of 2] Linking shape [Objects changed]
$ ./shape
15.141593
```

Nice, right?

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
shape: shape.hs:(9,1)-(13,23): Non-exhaustive patterns in function shapeArea
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

shape.hs:11:1: warning: [-Wincomplete-patterns]
    Pattern match(es) are non-exhaustive
    In an equation for ‘shapeArea’:
        Patterns of type ‘Shape’ not matched: Parallelogram _ _ _
   |
11 | shapeArea (Circle r) = pi * (r ** 2)
   | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^...
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

shape.hs:12:1: error: [-Wincomplete-patterns, -Werror=incomplete-patterns]
    Pattern match(es) are non-exhaustive
    In an equation for ‘shapeArea’:
        Patterns of type ‘Shape’ not matched: Parallelogram _ _ _
   |
12 | shapeArea (Circle r) = pi * (r ** 2)
   | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^...
```

That's not ideal. But at least we have the option. Haskell has been around since
1990, this is probably just a result of the maintainers not wanting to introduce
a breaking behavior into the compiler.

There have been many new languages introduced since then, including some with
exhaustiveness checks enabled by default!

### Rust

This brings us to Rust! Its syntax is more of a happy medium between imperative
programming and functional programming. It should be easier to read for
imperative-brained developers while also offering the purity and safety of
functional programming. 😁

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

fn shape_area(shape: Shape) -> f64 {
    match shape {
        Shape::Circle(Circle { r }) => PI * r * r,
        Shape::Rectangle(Rectangle { w, h }) => w * h,
        Shape::Triangle(Triangle { a, b, c }) => {
            let s = (a + b + c) / 2.0;
            f64::sqrt(s * (s - a) * (s - b) * (s - c))
        }
    }
}

fn main() {
    let shapes = [
        Shape::Circle(Circle { r: 1.0 }),
        Shape::Rectangle(Rectangle { w: 2.0, h: 3.0 }),
        Shape::Triangle(Triangle {
            a: 3.0,
            b: 4.0,
            c: 5.0,
        }),
    ];
    println!("{}", shapes.map(shape_area).iter().sum::<f64>())
}
```

We have a few structs representing our shapes, an enum that allows us to store
shapes in the same location, a function for calculating the total area of all
the shapes, and a main function for testing it out.

Looks pretty good! It's a little bit more verbose, and some of the syntax looks
a little weird, but it works!

Let's compile and run it now:

```text
$ cargo run
   Compiling website v0.1.0 (/workspaces/website)
    Finished dev [unoptimized + debuginfo] target(s) in 1.57s
     Running `target/debug/website`
15.141592653589793
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
error[E0004]: non-exhaustive patterns: `Shape::Parallelogram(_)` not
covered
  --> src/main.rs:32:11
   |
32 |     match shape {
   |           ^^^^^ pattern `Shape::Parallelogram(_)` not covered
   |
note: `Shape` defined here
  --> src/main.rs:24:6
   |
24 | enum Shape {
   |      ^^^^^
...
28 |     Parallelogram(Parallelogram),
   |     ------------- not covered
   = note: the matched value is of type `Shape`
help: ensure that all possible cases are being handled by adding a match
arm with a wildcard pattern or an explicit pattern as shown
   |
38 ~         },
39 +         Shape::Parallelogram(_) => todo!()
   |

For more information about this error, try `rustc --explain E0004`.
error: could not compile `website` (bin "website") due to previous error
```

Excellent! Not only did we get an error, but it was fatal, and it explains
exactly what we need to do to fix it. Very nice.

Maybe now you can see that one of the reasons why Rust is so difficult is that
its syntax is a little weird and it has an entire set of checks that other
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

type Shape = Circle | Rectangle | Triangle;

const shapeArea = (shape: Shape) => {
  switch (shape.type) {
    case "circle":
      return Math.PI * shape.r * shape.r;
    case "rectangle":
      return shape.w * shape.h;
    case "triangle": {
      const s = (shape.a + shape.b + shape.c) / 2;
      return Math.sqrt(s * (s - shape.a) * (s - shape.b) * (s - shape.c));
    }
    default:
      assertNever(shape);
  }
};
```

The compiler will properly infer the types of `shape` within each case
statement, and if another variant is added to `Shape`, then we'll get a compile
time error via `assertNever()`:

```typescript
// ...

type Parallelogram = { type: "parallelogram"; a: number; b: number; t: number };

type Shape = Circle | Rectangle | Triangle | Parallelogram;

// ...
```

```text
$ deno check test.ts
Check file:///workspaces/website/test.ts
error: TS2345 [ERROR]: Argument of type 'Parallelogram' is not assignable to parameter of type 'never'.
      assertNever(shape);
                  ~~~~~
    at file:///workspaces/website/test.ts:30:19
```

While not quite as helpful as the error in Rust, this at least tells us that it
has something to do with a Parallelogram and ensures that there is a case for
every shape type.

### TS-Pattern

My preferred option is to use
[`ts-pattern`](https://www.npmjs.com/package/ts-pattern). It allows you to match
on the structure and type of a variable in a much more nuanced way than with a
basic `switch`/`case`.

Here's the re-written shapes example:

```typescript
import { match } from "npm:ts-pattern";

type Circle = { type: "circle"; r: number };

type Rectangle = { type: "rectangle"; w: number; h: number };

type Triangle = { type: "triangle"; a: number; b: number; c: number };

type Shape = Circle | Rectangle | Triangle;

const shapeArea = (shape: Shape) =>
  match(shape)
    .with({ type: "circle" }, ({ r }) => Math.PI * r * r)
    .with({ type: "rectangle" }, ({ w, h }) => w * h)
    .with({ type: "triangle" }, ({ a, b, c }) => {
      const s = (a + b + c) / 2;
      return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    })
    .exhaustive();
```

Nice and concise!

And now if we add another Shape variant:

```typescript
// ...

type Parallelogram = { type: "parallelogram"; a: number; b: number; t: number };

type Shape = Circle | Rectangle | Triangle | Parallelogram;

// ...
```

```text
$ deno check test.ts
Check file:///workspaces/website/test.ts
error: TS2349 [ERROR]: This expression is not callable.
  Type 'NonExhaustiveError<Parallelogram>' has no call signatures.
    .exhaustive();
     ~~~~~~~~~~
    at file:///workspaces/website/test.ts:25:6
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

We can even get rid of the `type` property entirely, and just match on the
structure of the shape passed to `match()`:

```typescript
import { match, P } from "npm:ts-pattern";

type Circle = { r: number };

type Rectangle = { w: number; h: number };

type Triangle = { a: number; b: number; c: number };

type Shape = Circle | Rectangle | Triangle;

const shapeArea = (shape: Shape) =>
  match(shape)
    .with({ r: P.number }, ({ r }) => Math.PI * r * r)
    .with({ w: P.number, h: P.number }, ({ w, h }) => w * h)
    .with({ a: P.number, b: P.number, c: P.number }, ({ a, b, c }) => {
      const s = (a + b + c) / 2;
      return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    })
    .exhaustive();
```

Neat!

`ts-pattern` supports a bunch of different ways to match and also comes with a
few other useful utilities. Be sure to check out the
[docs](https://github.com/gvergnaud/ts-pattern?tab=readme-ov-file#documentation)!

### TC39 Proposal

TC39 is a Technical Committee working on the standard for JavaScript. They
propose, review, and approve new features for the language that later get
implemented runtimes. There's a proposal for adding pattern matching to
JavaScript itself. I highly recommend taking a look at
[the proposal](https://github.com/tc39/proposal-pattern-matching).

The proposal itself is still in its early stages, so it might be quite a while
before we see first-class support in the wild.

## Conclusion

I hope that after reading through these examples you've gained some insight into
the programming languages that I discussed, and understand why pattern matching
is such an important modern programming technique.

When maintaining a large code base, it can be impossible to remember every
single piece of code that needs to be updated when modifying the types or
structure of your data. Relying on the compiler to detect where there may be an
issue makes the code easier to quickly and safely refactor.

Understanding functional and modern programming techniques like this can help
make your code clearer and safer even when you're not using a language like Rust
that has these features built-in. Happy coding!
