# Triven
> A markdown-based blog generator

[![CircleCI](https://circleci.com/gh/glorious-codes/glorious-triven/tree/master.svg?style=svg)](https://circleci.com/gh/glorious-codes/glorious-triven/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/glorious-codes/glorious-triven/badge.svg?branch=master)](https://coveralls.io/github/glorious-codes/glorious-triven?branch=master)

## Installation

```
npm install -D @glorious/triven
```

## Usage

To get started with Triven, you need to run the following command at the root directory of your project:

```
npx triven build
```

After running this command, a directory called `triven` and a demo post will be created.

### Setup

To override the default values used to build your blog, you can write a file called `triven.config.js` in the root directory of your project containing the following options:

``` javascript
// triven.config.js

module.exports = {
  title: 'Your Blog Title',
  // Used as browser window title.
  // Default: Triven.
  sourceDirectory: './posts',
  // Directory where triven will look for markdown files.
  // Default: Root directory of your project ('./').
  outputDirectory: './dist'
  // Directory where the final files will be saved.
  // Default: './triven'.
}
```

### Markdown Articles

You can prefix your Markdown articles with a header containing some metadata:

| Name | Description | Default Value |
|------|-------------|---------------|
| title | Title for your post | Untitled |
| lang | Language which your article is written in | en-US |
| date | Date expressed according to ISO 8601 (YYYY-MM-DD) |  |
| description | A brief description of your post (used in HTML meta tags) |  |
| keywords | Keywords for your post (used in HTML meta tags) |  |
| externalUrl | URL for a post published in an external website |  |
| excerpt | An optional text representing the first paragraphs of your post | First 340 chars of your post |

**Important:** Do not forget to separate your article from its metadata with three dashes.

#### Markdown Example

```
title: Unconditional Inhotim
date: 2020-06-28
description: Inhotim is a wonderful mix of contemporary art museum and botanical garden located in Minas Gerais, Brasil. This article explores a bit of my experience in there and reflects about what the are is.
keywords: Inhotim, contemporary art, garden
externalUrl: https://rafaelcamargo.com/unconditional-inhotim
excerpt: We all can recognize beauty at the right moment we stand before it. That was the certainty that I had the day I visited the world's largest open-air contemporary art museum.
lang: en-US

---

We all can recognize beauty at the right moment we stand before it. That was the certainty that I had the day I visited the world's largest open-air contemporary art museum. It's a garden that could be called paradise. Inhotim.

...
```

## Contributing

If you want to contribute to this project, follow [these instructions](CONTRIBUTING.md).
