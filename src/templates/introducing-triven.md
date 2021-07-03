
title: Introducing Triven
date: {date}

---

Triven is a Markdown-based blog generator. It's different from well-known solutions like Jekyll, Hugo, or Gatsby. It was designed to build a minimal blog, not to create an entire website. By *minimal*, it means almost zero features. Tailored to highlight the content, not the form, it offers no themes, no menus, no any other thing that could take the readers' eyes away from your words.

## Getting started

If you landed here, chances are you're familiar with coding and, therefore, well versed with JavaScript.

Before getting started with Triven, you need to install it in your project as follows:

```
npm install -D @glorious/triven
```

After installing it, you need to run the following command at the root directory of your project to get started with Triven:

```
npx triven build
```

When the command finishes, a directory called `triven` and a demo post - yes, this post you're reading exactly now - will be created.

## Setup

To override the default values used to build your blog, you can write a file called `triven.config.js` in the root directory of your project containing the following options:

``` javascript
// triven.config.js

module.exports = {
  title: 'Your Blog Title',
  // Used as browser window title.
  // Default: Triven.
  sourceDirectory: './posts',
  // Directory where triven will look for markdown files.
  // Default: Root directory of your project.
  outputDirectory: './dist'
  // Directory where the final files will be saved.
}
```

## Contributing

If you want to contribute to this project, follow these [instructions](https://github.com/glorious-codes/glorious-triven/blob/master/CONTRIBUTING.md).
