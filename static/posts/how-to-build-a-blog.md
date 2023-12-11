---
title: How to Build a Blog
date: 12/10/2023
tags:
  - react
  - deno
  - fresh
description: How and why I built my blog ... and you can too!
coverAltText: "Note: Although this image is AI generated, the rest of this post is not."
---

## Motivation

Let's say you've always wanted to build your own website. Maybe you're
interested in learning React. Perhaps you're tired of complicated Node JS web
frameworks and don't want to spend an exorbitant amount of time learning one on
top of React. Possibly you're a bit sick of Node JS in general.

I have good news! Many other people feel the same way. Even the creator of Node.
So much so, that he's created a new JavaScript (and TypeScript) runtime called
Deno. It fixes many of the things about Node JS that probably leave a bitter
taste in your mouth. Such as:

- out of the box TypeScript support
- built-in formatting
- built-in linting
- top-level async/await
- no node_modules/
- ECMAScript Module support (no CommonJS 😎)
- ...

These same people, who are tired of cumbersome Node JS web frameworks, have
created some slick, **minimal**, web frameworks for it. One such framework is
Fresh. If you're thinking: "No! Not another web framework!", hear me out. Fresh
is great because it has:

- no build step
- no configuration
- speed
- simplicity

Fresh does all of those things and more. It's so clean and simple that it "makes
web development fun again". Deno and Fresh complement each other like sunshine
and beaches.

The cherry on top is that Deno and Fresh have both been designed for deployment
on Deno Deploy, which is a serverless hosting service with zero config.
Serverless hosting means that a service is only running when it is needed. It
also means, that it's very cheap to run, and better for the environment! This
site is currently hosted on it for free.

## Implementation

Maybe I've piqued your interest, but designing a blog still seems like a
daunting task. Again, I have great news! We can keep it very simple with these
design requirements:

1. posts are written in Markdown
2. posts are added by committing them to your project
3. no additional code needs to be written to publish each post

These might sound pretty basic, but it's important to start somewhere, and
starting simple is the best way to ensure something actually gets done. Another
popular tactic is to use a reference when building something new for the first
time. It turns out, Fresh's docs are designed this same exact way, so we can
just refer to its code! 😀

### Rendering Markdown

In order to display a post on our site we'll need to convert (render) each
markdown file into HTML. There happens to be a page in the Fresh docs about
[rendering Markdown](https://fresh.deno.dev/docs/examples/rendering-markdown).

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

**TODO**

- You may want to add properties to MarkdownProps for things such as the render
  options, custom styles, and classes. I had some trouble getting the rendered
  markdown to look right with the `CSS` from [`gfm`](https://deno.land/x/gfm),
  so I created a CSS file to patch some of the styles. You can see it
  [here](https://github.com/mrkjdy/website/blob/08bbefb39b0f8d8f911aabf38cfe178edb750912/static/styles/markdown-body.css).

### Creating a Dynamic Route for Posts

Now that we have a component that can be used to display Markdown, we need to
actually use it to render our posts. The Fresh docs explain that we can use a
[dynamic route](https://fresh.deno.dev/docs/getting-started/dynamic-routes) to
render a page using a part of the path. For example, if someone goes to
`www.oursite.com/posts/title-of-a-post`, then we can load the corresponding post
and use it to render the page.

Let's go ahead and create a file for a dynamic route like mentioned above. The
Fresh docs give us a basic example that we can use to get started with, so let's
begin with something similar:

```tsx
// routes/posts/[name].tsx

import { PageProps } from "$fresh/server.ts";

export default (props: PageProps) => (
  <>
    {props.params.name}
  </>
);
```

This gives us a route that just responds with whatever path we put after
`/posts`.

### Handling Post Requests

What do we need next? Well, if the `name` param represents a path to a post, we
should use it to find a corresponding Markdown file, and render the post if it
exists, or a 404 page if it doesn't. The docs explain that we can create a
[handler](https://fresh.deno.dev/docs/getting-started/custom-handlers) to
[fetch](https://fresh.deno.dev/docs/getting-started/fetching-data) data before
rendering a page.

Following the examples in the docs, let's go ahead and create a handler for our
page and use it to pass data to the page component:

```tsx
// routes/posts/[name].tsx

import { Handlers, PageProps } from "$fresh/server.ts";
import Markdown from "../../components/Markdown.tsx";

// A map of post paths to Markdown. We'll leave it empty for now
const postMap = new Map<string, string>();

export const handler: Handlers<string> = {
  GET: (_, ctx) => {
    const { name } = ctx.params;
    // Check if the post exists
    const post = postMap.get(name);
    if (post === undefined) { // Render a 404 page if it doesn't
      return ctx.renderNotFound();
    }
    return ctx.render(post); // Render a post page if it does
  },
};

// Let's modidfy our render function to use the Markdown component with
// the Markdown passed from our handler.
export default (props: PageProps<string>) => (
  <>
    <Markdown markdown={props.data} />
  </>
);
```

**TODO**

- You will probably want to add more to this page. See the
  [Post Frontmatter](#post-frontmatter) section below to learn about adding
  things like a title, date, or tags to each post.
- Fresh provides default error pages, but if you would like to customize them be
  sure to checkout the docs
  [here](https://fresh.deno.dev/docs/concepts/error-pages).

### Loading Posts from a Directory

Next, we need to load the posts we've written into `postMap`. Let's use Deno to
read our Markdown files from a directory. I would also recommend creating a new
file to hold this code so that `routes/posts/[name].tsx` doesn't get too
cluttered.

```tsx
// utils/posts.ts

import { basename, extname } from "$std/path/mod.ts";

// Let's move postMap here
export const postMap = new Map<string, string>();

// Let's create a constant for the directory to our posts so that if it
// ever needs to be changed, we can do it in one location.
const POSTS_DIR_PATH = "./static/posts/";

// Load the posts from the file system
for await (const dirEntry of Deno.readDir(POSTS_DIR_PATH)) {
  const { name: filename } = dirEntry;
  if (dirEntry.isFile && filename.endsWith(".md")) {
    const postPath = `${POSTS_DIR_PATH}${filename}`;
    const fileContents = await Deno.readTextFile(postPath);
    // We'll use the basename of each filename as the key in the postMap
    const postBasename = basename(filename, extname(filename));
    postMap.set(postBasename, fileContents);
  }
}
```

Now we have basically everything we need! I'd recommend creating some test posts
to see how they look.

### Post Frontmatter

Although we have the ability to render posts, we don't have a great way to
browse through posts or show information about each post in a uniform way. In
other words, right now we don't have a way to display information like the post
title, date, tags, etc. in a common location.

One way to accomplish this, is to add parsable
[frontmatter](https://en.wikipedia.org/wiki/Book_design#Front_matter) to the
beginning of each Markdown file. The Deno std library actually supports
Frontmatter and is used by Fresh for extracting metadata on each page in the
docs. You can checkout the docs for the `front_matter` module
[here](https://deno.land/std@0.208.0/front_matter/mod.ts).

You can refer to my
[`utils/posts.ts`](https://github.com/mrkjdy/website/blob/62f0d83053a26004732c04be3cbe03094ae00ffd/utils/posts.ts)
to see how I extract frontmatter from Markdown file. It involves just a few
modifications to the example code above.

## Improvements

I hope you've found this guide useful! It should help you get started with Fresh
and understand the basic design of a blog. You will need to make some important
improvements such as
[setting up styles](https://fresh.deno.dev/docs/examples/migrating-to-tailwind),
and adding things like a home page and a list of posts. You can take a look at
the code of my blog, or if you like it, you can fork it and customize it to your
needs.

A few things I plan on adding to this site later are:

- comments on posts
- likes on posts
- a way to search posts
- post thumbnails
