const md5 = require('md5');
const path = require('path');
const stylus = require('stylus');
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

_public.appendBaseStylesheet = (htmlString, { hrefPrefix = '' } = {}) => {
  const $ = domService.parseHTMLString(htmlString);
  const href = hrefPrefix ? `${hrefPrefix}${baseFilename}` : baseFilename;
  $('head').append(`<link rel="stylesheet" href="${href}">`);
  return $.html();
};

function buildBaseFilename(baseStylesheet){
  baseFilename = `assets/triven-${md5(baseStylesheet)}.css`;
  return baseFilename;
}

module.exports = _public;
