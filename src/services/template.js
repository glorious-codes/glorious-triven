const path = require('path');
const assetsService = require('./assets');
const configService = require('./config');
const domService = require('./dom');
const { fileService } = require('./file');
const stylesService = require('./styles');

const _public = {};

_public.getArticleTemplate = ({ lang } = {}) => getTemplateByName('article', '../', lang);

_public.getHomepageTemplate = ({ assetsDirPrefix = '', customLang } = {}) => {
  const language = customLang || configService.get().lang;
  const template = setLang(getTemplateByName('homepage', assetsDirPrefix, language), language);
  return handleHomepageTitle(template);
};

_public.getDemoPostTemplate = () => getByFilename('introducing-triven.md');

_public.replaceVar = (htmlString, key, value) => {
  const regex = new RegExp(`\\{\\{(\\s+)?${key}(\\s+)?\\}\\}`, 'g');
  return htmlString.replace(regex, value);
};

function handleHomepageTitle(template){
  const { title } = configService.get();
  const $ = parseHTMLString(template);
  title && $('head').append(`<title>${title}</title>`);
  return $.html();
}

function getTemplateByName(name, assetsDirPrefix, lang){
  const filepath = configService.getCustomTemplateFilepath(name);
  const template = filepath ?
    buildBaseMetaTags(parseTemplate(fileService.readSync(filepath), path.dirname(filepath), assetsDirPrefix, lang)) :
    buildBaseMetaTags(getByFilename(`${name}.html`));
  return includeBaseStylesheet(template, assetsDirPrefix);
}

function parseTemplate(htmlString, baseDir, assetsDirPrefix, lang){
  return assetsService.handleRelativeAssets(handleCustomVars(htmlString, lang), { baseDir, assetsDirPrefix });
}

function getByFilename(filename){
  return fileService.readSync(path.join(__dirname, `../templates/${filename}`));
}

function handleCustomVars(template, lang){
  const vars = configService.getCustomTemplateVars();
  return vars ? replaceTemplateVars(template, vars, lang) : template;
}

function replaceTemplateVars(template, vars, lang){
  const { key, value: rawValue } = vars.shift();
  const value = parseTemplateVarValue(rawValue, lang);
  if(vars.length) return replaceTemplateVars(_public.replaceVar(template, key, value), vars, lang);
  return _public.replaceVar(template, key, value);
}

function parseTemplateVarValue(value, lang){
  return typeof value == 'function' ? value(lang) : value;
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
