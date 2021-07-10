const path = require('path');
const configService = require('./config');
const domService = require('./dom');
const { fileService } = require('./file');

const _public = {};

_public.getArticleTemplate = () => getTemplateByName('article');

_public.getHomepageTemplate = () => {
  const { title } = configService.get();
  const template = getTemplateByName('homepage');
  const $ = parseHTMLString(template);
  title && $('head').append(`<title>${title}</title>`);
  return $.html();
};

_public.getDemoPostTemplate = () => getByFilename('introducing-triven.md');

function getTemplateByName(name){
  const filepath = configService.getCustomTemplateFilepath(name);
  const template = filepath ? fileService.readSync(filepath) : getByFilename(`${name}.html`);
  return buildBaseMetaTags(template);
}

function getByFilename(filename){
  return fileService.readSync(path.join(__dirname, `../templates/${filename}`));
}

function buildBaseMetaTags(htmlString){
  const $ = parseHTMLString(htmlString);
  $('head').prepend(`
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  `);
  return $.html();
}

function parseHTMLString(htmlString){
  return domService.parseHTMLString(htmlString);
}

module.exports = _public;
