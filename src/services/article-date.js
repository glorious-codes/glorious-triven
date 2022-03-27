const configService = require('./config');
const dateService = require('./date');

const _public = {};

_public.format = (isoDateString, lang) => {
  const formatDate = configService.getDateFormatter();
  return formatDate ? formatDate(isoDateString, lang) : dateService.format(isoDateString, lang);
};

module.exports = _public;
