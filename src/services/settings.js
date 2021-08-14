const LANGUAGES = require('../constants/languages.json');
const domService = require('./dom');

const _public = {};

_public.build = (languages, options = {}) => {
  if(!languages || languages.length === 1) return '';
  return domService.minifyHTML(`
    <div class="tn-settings">
      <div class="tn-settings-content">
        ${buildLanguageMenu(languages, options)}
      </div>
    </div>
  `);
};

function buildLanguageMenu(languages, { selectedLanguage, hrefPrefix }){
  const label = buildLanguageTriggerLabel(selectedLanguage);
  return `
    <nav class="tn-settings-language">
      <div class="tn-settings-list-wrapper">
        <div class="tn-settings-list-container" tabindex="0">
          <span class="tn-screen-reader-only">Current language: ${label}</span>
          <span class="tn-settings-list-showing-trigger" aria-hidden="true">${label}</span>
          <span class="tn-screen-reader-only">Available languages:</span>
          ${buildLanguageMenuItems(languages, hrefPrefix)}
        </div>
        <button class="tn-settings-list-hiding-trigger" aria-hidden="true" tabindex="0">Close</button>
      </div>
    </nav>
  `;
}

function buildLanguageTriggerLabel(selectedLanguage){
  return selectedLanguage ? buildLanguageLabel(selectedLanguage) : 'Multi-language';
}

function buildLanguageMenuItems(languages, hrefPrefix = './'){
  return `
    <ul class="tn-settings-list">
      <li>
        <a href="${hrefPrefix}">Multi-language</a>
      </li>
      ${languages.map(lang => (`
        <li>
          <a href="${hrefPrefix}l/${lang}">${buildLanguageLabel(lang)}</a>
        </li>
      `)).join('')}
    </ul>
  `;
}

function buildLanguageLabel(lang){
  const [code, countryCode] = lang.split('-');
  const name = LANGUAGES[code];
  return countryCode ? `${name} ${countryCode.toUpperCase()}` : name;
}

module.exports = _public;
