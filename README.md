# Triven
> A markdown-based blog generator

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
