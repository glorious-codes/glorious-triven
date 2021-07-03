# Triven
> A markdown-based blog generator

[![CircleCI](https://circleci.com/gh/glorious-codes/glorious-triven/tree/master.svg?style=svg)](https://circleci.com/gh/glorious-codes/glorious-triven/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/glorious-codes/glorious-triven/badge.svg?branch=master)](https://coveralls.io/github/glorious-codes/glorious-triven?branch=master)

## Installation

```
npm install -D @glorious/triven
```

## Usage

To get started with Triven, you just need to run the following command at the root directory of your project:

```
npx triven build
```

After running this command, a directory called `triven` and a demo post will be created.

### Setup

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

If you want contribute with this project, follow [this instructions](CONTRIBUTING.md).
