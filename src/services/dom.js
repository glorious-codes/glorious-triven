const cheerio = require('cheerio');
const { minify } = require('html-minifier');

const _public = {};

_public.parseHTMLString = string => {
  return cheerio.load(string);
};

_public.minifyHTML = string => {
  return minify(string, { collapseWhitespace: true });
};

module.exports = _public;
