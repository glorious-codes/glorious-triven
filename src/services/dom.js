const cheerio = require('cheerio');
const minifyService = require('./minify');

const _public = {};

_public.parseHTMLString = string => {
  return cheerio.load(string);
};

_public.minifyHTML = htmlString => {
  return minifyService.minifyHTML(htmlString);
};

module.exports = _public;
