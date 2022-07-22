const htmlMinifier = require('html-minifier');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');
const { fileService } = require('./file');

const _public = {};

_public.minifyByFilepath = filepath => {
  const { extension } = fileService.getFileInfoByFilepath(filepath);
  const minify = getMinifierByFileExtension(extension);
  const file = fileService.readSync(filepath);
  return minify ? minify(file) : file;
};

_public.minifyHTML = htmlString => {
  return htmlMinifier.minify(htmlString, {
    collapseWhitespace: true,
    collapseBooleanAttributes: true
  });
};

_public.minifyCSS = cssString => {
  const cssMinifier = new CleanCSS({ level: { 1: { specialComments: 0 } } });
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
