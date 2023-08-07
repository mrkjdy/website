---
title: How to Build a Blog
date: 8/6/2023
tags:
  - react
  - deno
  - fresh
description: In this blog, I show how and why I built my blog website
coverPhoto: ../test/cover.png # Use beach picture from google photos
---

## Motivation

Let's say you've always wanted to build your own website. Maybe you're
interested in learning React. Perhaps you're tired of complicated Node JS web
frameworks and don't want to spend an exorbitant amount of time learning one on
top of React. Possibly you're a bit sick of Node JS in general.

I have some good news for you my friend! Many other people feel the same way.
Even the creator of Node. So much so, that he has created a new JavaScript (and
TypeScript) runtime called Deno. Why should I go out of my way to learn how to
use Deno you ask? Well, it fixes many of the things about Node JS that probably
left a bitter taste in your mouth. Such as:

- ECMAScript Module support (no CommonJS 😲)
- out of the box TypeScript support
- built-in formatting
- built-in linting
- top-level async/await
- ... the list goes on

People have even created some slick new, **minimal**, web frameworks for it. One
such framework is Fresh. What's so great about Fresh you ask? I reply:

- How about no build step?
- How about no configuration?
- How about speed?
- How about simplicity?

Fresh does all of those things and more. It's so clean and simple that it "makes
web development fun again". Deno and Fresh complement each other like sunshine
and beaches.

The cherry on top is that Deno and Fresh have both been designed for deployment
on Deno Deploy, which is a serverless hosting service with zero config.
Serverless hosting means that a service is only running when it is needed. Not
only is that better for the environment than traditional hosting, but it's also
cheaper for users like you and me! This site is currently hosted on it for free.

## Implementation

Maybe I've piqued your interest, but designing a blog still seems like a
daunting task. Again, I have great news! We can keep it very simple. Let's agree
upon some requirements for a design:

1. blogs are written in markdown
2. blogs are added by committing them to your project
3. no additional code needs to be written to publish each post

But how do we actually do this? It's easy! So simple in fact, that we don't even
need to come up with anything new. We can just copy Fresh! Fresh's docs are
already built following these requirements.

### Rendering Markdown

There happens to be a page in the documentation about
[rendering markdown](https://fresh.deno.dev/docs/examples/rendering-markdown).

Let's start by building a component for rendering Markdown into HTML so that we
can use it anywhere on our site:

```tsx
// components/Markdown.tsx

import { CSS, render } from "$gfm/mod.ts";

export type MarkdownProps = {
  markdown: string;
};

export default (props: MarkdownProps) => (
  <>
    <Head>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </Head>
    <div
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body"
      dangerouslySetInnerHTML={{ __html: render(props.markdown) }}
    />
  </>
);
```

You may want to add properties to MarkdownProps for things such as the render
options, custom styles, and classes. I had some trouble getting the rendered
markdown to look right with the `CSS` from `gfm`, so I also created a CSS file
to patch some of the styles. You can see it
[here](https://github.com/mrkjdy/website/blob/08bbefb39b0f8d8f911aabf38cfe178edb750912/static/styles/markdown-body.css).

### Creating a Dynamic Route for Blogs

Now that we have a component that can be used to display markdown, we need to
actually use it to render our blogs. The Fresh docs explain that we can use a
[dynamic route](https://fresh.deno.dev/docs/getting-started/dynamic-routes) to
render a page using a part of the path. For example, if someone goes to
`www.oursite.com/blogs/title-of-a-blog`, then we can load the corresponding blog
and use it to render the page.

Let's go ahead and create a file for a dynamic route like mentioned above. The
Fresh docs give us a basic example that we can use to get started with, so let's
begin with something similar:

```tsx
// routes/blogs/[name].tsx

import { PageProps } from "$fresh/server.ts";

export default (props: PageProps) => (
  <>
    {props.params.name}
  </>
);
```

This gives us a route that just responds with whatever path we put after
`/blogs`.

### Handling Blog Requests

What do we need next? Well, if the `name` param represents a path to a blog, we
should use it to load and render a blog, if it exists, or render a 404 page if
it doesn't. The docs explain that we can create a
[handler](https://fresh.deno.dev/docs/getting-started/custom-handlers) to
[fetch](https://fresh.deno.dev/docs/getting-started/fetching-data) data before
rendering a page.

Following the examples in the docs, let's go ahead and create a handler for our
page and use it to pass data to the page component:

```tsx
// routes/blogs/[name].tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import Markdown from "../../components/Markdown.tsx";

// A map of blog paths to markdown. We'll leave it empty for now
const blogMap = new Map<string, string>();

export const handler: Handlers<string> = {
  GET: (_, ctx) => {
    const { name } = ctx.params;
    // Check if the blog exists
    const blog = blogMap.get(name);
    if (blog === undefined) { // Render a 404 page if it doesn't
      return ctx.renderNotFound();
    }
    return ctx.render(blog); // Render a blog page if it does
  },
};

// Let's modidfy our render function to use the Markdown component with
// the markdown passed from our handler.
export default (props: PageProps<string>) => (
  <>
    <Markdown markdown={props.data} />
  </>
);
```

### Loading Blogs from a Directory

We've made excellent progress! Next, we need to load the blogs we've written
into `blogMap`. Let's use Deno to read our markdown files from a directory. I
would also recommend creating a new file to hold this code so that
`routes/blogs/[name].tsx` doesn't get too cluttered.

```tsx
// utility/blogs.ts

import { basename, extname } from "$std/path/mod.ts";

// Let's move blogMap here
export const blogMap = new Map<string, string>();

// Let's create a constant for the directory to our blogs so that if it
// ever needs to be changed, we can do it in one location.
const BLOGS_DIR_PATH = "./static/blogs/";

// Load the blogs from the file system
for await (const dirEntry of Deno.readDir(BLOGS_DIR_PATH)) {
  const { name: filename } = dirEntry;
  if (dirEntry.isFile && filename.endsWith(".md")) {
    const blogPath = `${BLOGS_DIR_PATH}${filename}`;
    const fileContents = await Deno.readTextFile(blogPath);
    // We'll use the basename of each filename as the key in the blogMap
    const blogBasename = basename(filename, extname(filename));
    blogMap.set(blogBasename, fileContents);
  }
}
```

Now we have basically everything we need! I'd recommend creating some test blogs
to see how they look.

### Blog Frontmatter

```tsx
type Blog = {
  title: string;
  date: string;
  markdown: string;
  // ... any other data you would like
};

// The modified render function that uses the new Blog data
export default (props: PageProps<string>) => (
  <>
    <article>
      <h1>{props.data.title}</h1>
      <br />
      <p>
        <span>{props.data.date}</span>
      </p>
      <br />
      <Markdown markdown={props.data.markdown} />
    </article>
  </>
);
```

## Performance

TODO - lighthouse performance

## Improvements

- comments
- like button
- search?
