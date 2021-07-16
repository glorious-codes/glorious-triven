const md5 = require('md5');
const path = require('path');
const stylus = require('stylus');
const { ASSETS_DIRECTORY_NAME } = require('../constants/assets');
const domService = require('./dom');
const { fileService } = require('./file');
const minifyService = require('./minify');

const _public = {};

let baseFilename;

_public.buildBaseStyle = (outputDirectory, onComplete) => {
  const hljsStyles = fileService.readSync(path.join(__dirname, '../styles/hljs.css'));
  const styles = fileService.readSync(path.join(__dirname, '../styles/base.styl'));
  stylus(styles).render((err, css) => {
    const data = minifyService.minifyCSS(`${hljsStyles}\n${css}`);
    fileService.write(`${outputDirectory}/${buildBaseFilename(data)}`, data);
    onComplete && onComplete();
  });
};

_public.includeBaseStylesheet = (htmlString, { hrefPrefix = '' } = {}) => {
  const $ = domService.parseHTMLString(htmlString);
  const exisitingStylesheets = $('link[rel="stylesheet"]');
  if(exisitingStylesheets.length) $($(exisitingStylesheets).eq(0)).before(buildBaseStylesheetLinkTag(hrefPrefix));
  else $('head').append(buildBaseStylesheetLinkTag(hrefPrefix));
  return $.html();
};

function buildBaseStylesheetLinkTag(hrefPrefix){
  return `<link rel="stylesheet" href="${buildStylesheetHref(hrefPrefix)}">`;
}

function buildStylesheetHref(hrefPrefix){
  return hrefPrefix ? `${hrefPrefix}${baseFilename}` : baseFilename;
}

function buildBaseFilename(baseStylesheet){
  baseFilename = `${ASSETS_DIRECTORY_NAME}/triven-${md5(baseStylesheet)}.css`;
  return baseFilename;
}

module.exports = _public;
