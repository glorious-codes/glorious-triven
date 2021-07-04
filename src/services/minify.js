const path = require('path');
const htmlMinifier = require('html-minifier');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');
const { fileService } = require('./file');

const _public = {};

_public.minifyByFilepath = filepath => {
  const { name, extension } = fileService.getFileInfoByFilepath(filepath);
  const minify = getMinifierByFileExtension(extension);
  return minify ? minify(fileService.readSync(filepath)) : console.log(`${name} cannot be minified`);
};

_public.minifyHTML = htmlString => {
  return htmlMinifier.minify(htmlString, { collapseWhitespace: true });
};

_public.minifyCSS = cssString => {
  const cssMinifier = new CleanCSS();
  return cssMinifier.minify(cssString).styles;
};

_public.minifyJS = codeString => {
  return UglifyJS.minify(codeString).code;
};

function getMinifierByFileExtension(extension){
  const { minifyHTML, minifyCSS, minifyJS } = _public;
  return {
    css: minifyCSS,
    html: minifyHTML,
    js: minifyJS
  }[extension];
}

module.exports = _public;
