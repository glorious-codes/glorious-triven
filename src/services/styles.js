const path = require('path');
const stylus = require('stylus');
const domService = require('./dom');
const { fileService } = require('./file');

const _public = {};

_public.buildBaseStyle = (outputDirectory, onComplete) => {
  const hljsStyles = fileService.readSync(path.join(__dirname, '../../node_modules/highlight.js/styles/github.css'));
  const styles = fileService.readSync(path.join(__dirname, '../styles/base.styl'));
  stylus(styles).render((err, css) => {
    fileService.write(`${outputDirectory}/${getBaseFilename()}`, `${hljsStyles}\n${css}`);
    onComplete && onComplete();
  });
};

_public.appendBaseStylesheet = (htmlString, { hrefPrefix = '' } = {}) => {
  const filename = getBaseFilename();
  const $ = domService.parseHTMLString(htmlString);
  const href = hrefPrefix ? `${hrefPrefix}${filename}` : filename;
  $('head').append(`<link rel="stylesheet" href="${href}">`);
  return $.html();
};

function getBaseFilename(){
  return 'assets/triven.css';
}

module.exports = _public;
