const baseTranslations = require('../constants/translations');
const configService = require('./config');

const _public = {};

_public.get = lang => {
  const translations = getCustomTranslations(lang);
  return { ...baseTranslations, ...translations };
};

function getCustomTranslations(lang){
  const { translations } = configService.get();
  if(translations) return translations[lang];
}

module.exports = _public;
