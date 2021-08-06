const path = require('path');
const assetsService = require('./assets');
const configService = require('./config');
const domService = require('./dom');
const { fileService } = require('./file');
const stylesService = require('./styles');

const _public = {};

_public.getArticleTemplate = () => getTemplateByName('article', '../');

_public.getHomepageTemplate = ({ assetsDirPrefix = '', customLang } = {}) => {
  const { title, lang } = configService.get();
  const template = setLang(getTemplateByName('homepage', assetsDirPrefix), customLang || lang);
  const $ = parseHTMLString(template);
  title && $('head').append(`<title>${title}</title>`);
  return $.html();
};

_public.getDemoPostTemplate = () => getByFilename('introducing-triven.md');

_public.replaceVar = (htmlString, key, value) => {
  const regex = new RegExp(`\\{\\{(\\s+)?${key}(\\s+)?\\}\\}`, 'g');
  return htmlString.replace(regex, value);
};

function getTemplateByName(name, assetsDirPrefix){
  const filepath = configService.getCustomTemplateFilepath(name);
  const template = filepath ?
    buildBaseMetaTags(parseTemplate(fileService.readSync(filepath), path.dirname(filepath), assetsDirPrefix)) :
    buildBaseMetaTags(getByFilename(`${name}.html`));
  return includeBaseStylesheet(template, assetsDirPrefix);
}

function parseTemplate(htmlString, baseDir, assetsDirPrefix){
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
  if(!$('meta[name="viewport"]').length) $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">');
  if(!$('meta[charset]').length) $('head').prepend('<meta charset="utf-8">');
  return $.html();
}

function includeBaseStylesheet(htmlString, hrefPrefix){
  return stylesService.includeBaseStylesheet(htmlString, { hrefPrefix });
}

function setLang(homepageTemplate, lang){
  const $ = parseHTMLString(homepageTemplate);
  $('html').attr('lang', lang);
  return $.html();
}

function parseHTMLString(htmlString){
  return domService.parseHTMLString(htmlString);
}

module.exports = _public;
