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
  // Used as browser window title on homepage.
  // Default: Triven.
  lang: 'pt-BR',
  // Used as default language for articles and homepage.
  // Default: en-US.
  sourceDirectory: './posts',
  // Directory where triven will look for markdown files.
  // Default: Root directory of your project ('./').
  outputDirectory: './dist',
  // Directory where the final files will be saved.
  // Default: './triven'.
  templates: {
    article: './some/path/to/article/template.html',
    // You can optionally set an HTML file as template for articles
    homepage: './some/path/to/homepage/template.html',
    // You can optionally set an HTML file as template for homepage
    vars: {
      // You can optionally set variables in your templates
      // to be replaced with custom values in build time:
      someVar: 'someValue',
      anotherVar: 'anotherValue'
    }
  },
  // You can optionally set custom translations for labels used by Triven:
  translations: {
    'en-US': {
      availableRSSFeeds: 'RSS Feed options',      // Default: 'Available RSS Feeds'
      availableLanguages: 'Language options',     // Default: 'Available languages'
      currentLanguage: 'Selected language',       // Default: 'Current language'
      multiLanguage: 'All languages',             // Default: 'Multi-language'
      newer: 'Previous page',                     // Default: 'Newer'
      older: 'Next page',                         // Default: 'Older'
      readMore: 'Keep reading',                   // Default: 'Read more'
      rssFeed: 'Feed',                            // Default: 'RSS Feed'
      rssFeeds: 'Feeds',                          // Default: 'RSS Feeds'
      seeAllPosts: 'All publications'             // Default: 'See all posts'
    },
    // You can add specific-language dictionaries if you have a multi-language blog:
    'pt-BR': {
      // Portuguese translations
    }
  }
}
```

### Markdown Articles

You can prefix your Markdown articles with a header containing some metadata:

| Name | Description | Default Value |
|------|-------------|---------------|
| title | Title for your post | Untitled |
| lang | Language which your article is written in | language set on `triven.config.js` or en-US |
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

### Custom Templates

You can define your own HTML to be used as template for homepage and article. Just make sure that your HTML contain at least the following markup:

#### Homepage

``` html
<!DOCTYPE html>
<html>
  <head></head>
  <body>{{ triven:posts }}</body>
</html>
```

#### Article

``` html
<!DOCTYPE html>
<html>
  <head></head>
  <body>{{ triven:article }}</body>
</html>
```

You can optionally set variables in your templates to be replaced in build time. To do so, you need define them as key/value pairs in your `triven.config.js`, and reference them in your template HTML file as follow:

``` javascript
// triven.config.js

const date = new Date();

module.exports = {
  ...
  template: {
    ...
    vars: {
      copywrite: `©${date.getFullYear()} Triven`
    }
  }
}
```

``` html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    {{ triven:posts }}
    <footer>{{ copywrite }}</footer>
  </body>
</html>
```

**Note:** Variables in templates are *space insensitive*. You can write them as `{{copywrite}}` or `{{ copywrite }}`.

## Contributing

If you want to contribute to this project, follow [these instructions](CONTRIBUTING.md).
