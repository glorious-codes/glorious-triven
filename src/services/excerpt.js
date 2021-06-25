const domService = require('./dom');

const _public = {};

_public.extract = (htmlString, { excerpt = '' } = {}) => {
  return truncateText(parseParagraphText(excerpt)) || extractExcerptFromHTML(htmlString);
};

function extractExcerptFromHTML(htmlString){
  const $ = domService.parseHTMLString(`<div data-root>${htmlString}</div>`);
  const text = Array.from($('p').map((i, element) => {
    return parseParagraphText($(element).text());
  })).join(' ');
  return truncateText(text);
}

function parseParagraphText(text){
  return text.trim().replace(/\n/g, '').replace(/\s{2,}/g, ' ');
}

function truncateText(text){
  return text.length > 340 ? `${text.substring(0, 337)}...` : text;
}

module.exports = _public;
