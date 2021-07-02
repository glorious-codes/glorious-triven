
title: Introducing Triven
date: {date}

---

Triven is markdown-based blog generator. It differs from well know solutions like Jekyll, Hugo or Gatsby because it was designed not to create a website, but a minimal blog. By *minimal* it means almost zero features. Tailored to highlight the content, not the form, it offers no themes, no menus, no any other thing that could take the readers' eyes away from your words.

## Getting started

If you landed here, chances are you're familiar with coding and, therefore, well versed with JavaScript.

Before getting start with Triven, you need install it in your project as follows:

```
npm install -D @glorious/triven
```

After installing it, you just need to run the following command at the root directory of your project to get started with Triven:

```
npx triven build
```

When the command is done, a directory called `triven` and a demo post - yes, this post you're reading exactly now - will be created.

## Setup

To override the default values used to build your blog, you can write a file called `triven.config.js` in the root directory of your project passing the following options:

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

If you want contribute with this project, follow this [instructions](https://github.com/glorious-codes/glorious-triven/blob/master/CONTRIBUTING.md).
