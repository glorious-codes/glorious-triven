const marked = require('marked');
const dateService = require('./date');
const domService = require('./dom');
const { fileService } = require('./file');
const summaryService = require('./summary');

const _public = {};

_public.build = (filepath, template) => {
  const markdown = fileService.readSync(filepath);
  const summary = summaryService.build(markdown);
  const article = marked(removeMetadataLines(markdown.split('\n')));
  return { summary, article: fillTemplate(template, summary, article) };
};

function removeMetadataLines(markdownLines){
  const summaryDividerIndex = markdownLines.indexOf('---');
  return markdownLines.slice(summaryDividerIndex+1).join('').trim();
}

function fillTemplate(template, summary, article){
  const $ = parseHTMLString(template.replace('{article}', wrapArticle(summary, article)));
  $('html').attr('lang', summary.lang);
  $('head').prepend(`<title>${summary.title}</title>`);
  $('head').prepend(buildBaseMetaTags());
  return $.html();
}

function wrapArticle({ title, date, lang }, article){
  const header = `<header><h1>${title}</h1></header>`;
  const $ = parseHTMLString(`<article>${header}</article>`);
  date && $('header').append(`<p>${dateService.format(date, lang)}</p>`);
  $('article').append(article);
  return $.html();
}

function buildBaseMetaTags(){
  return `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  `;
}

function parseHTMLString(htmlString){
  return domService.parseHTMLString(htmlString);
}

module.exports = _public;
