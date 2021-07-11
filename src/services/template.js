const path = require('path');
const assetsService = require('./assets');
const configService = require('./config');
const domService = require('./dom');
const { fileService } = require('./file');

const _public = {};

_public.getArticleTemplate = () => getTemplateByName('article');

_public.getHomepageTemplate = ({ pageNumber } = {}) => {
  const { title } = configService.get();
  const template = getTemplateByName('homepage', pageNumber);
  const $ = parseHTMLString(template);
  title && $('head').append(`<title>${title}</title>`);
  return $.html();
};

_public.getDemoPostTemplate = () => getByFilename('introducing-triven.md');

_public.replaceVar = (htmlString, key, value) => {
  const regex = new RegExp(`\\{\\{(\\s+)?${key}(\\s+)?\\}\\}`, 'g');
  return htmlString.replace(regex, value);
};

function getTemplateByName(name, pageNumber){
  const filepath = configService.getCustomTemplateFilepath(name);
  if (filepath) return parseTemplate(fileService.readSync(filepath), path.dirname(filepath), pageNumber);
  return buildBaseMetaTags(getByFilename(`${name}.html`));
}

function parseTemplate(htmlString, baseDir, pageNumber){
  const assetsDirPrefix = pageNumber > 1 ? '../' : '';
  return assetsService.handleRelativeAssets(handleCustomVars(htmlString), { baseDir, assetsDirPrefix });
}

function getByFilename(filename){
  return fileService.readSync(path.join(__dirname, `../templates/${filename}`));
}

function handleCustomVars(template){
  const vars = configService.getCustomTemplateVars();
  return vars ? replaceTemplateVars(template, vars) : template;
}

function replaceTemplateVars(template, vars){
  const { key, value } = vars.shift();
  if(vars.length) return replaceTemplateVars(_public.replaceVar(template, key, value), vars);
  return _public.replaceVar(template, key, value);
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
