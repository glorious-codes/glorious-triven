const configService = require('./config');
const dateService = require('./date');

const _public = {};

// Opted to use Time tag after reading the following blog post:
// https://brucelawson.co.uk/2018/content-needs-a-publication-date/
_public.buildMarkup = (date, lang) => {
  return date ? `<time ${buildMarkupAttrs(date)}>${format(date, lang)}</time>` : '';
};

function buildMarkupAttrs(date){
  return Object.entries({
    class: 'tn-date',
    itemprop: 'dateCreated pubdate datePublished',
    datetime: date
  }).map(([key, value]) => `${key}="${value}"`).join(' ');
}

function format(isoDateString, lang){
  const formatDate = configService.getDateFormatter();
  return formatDate ? formatDate(isoDateString, lang) : dateService.format(isoDateString, lang);
}

module.exports = _public;
