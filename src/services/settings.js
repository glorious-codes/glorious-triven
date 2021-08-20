const LANGUAGES = require('../constants/languages.json');
const domService = require('./dom');
const translationService = require('./translation');

const _public = {};

_public.build = (languages, options = {}) => {
  return domService.minifyHTML(`
    <div class="tn-settings">
      <div class="tn-settings-content">
        ${handleLanguageMenu(languages, options)}
        <div class="tn-settings-rss-feed">
          ${handleRSSFeed(languages, options)}
        </div>
      </div>
    </div>
  `);
};

function handleLanguageMenu(languages, options){
  const translations = translationService.get(options.selectedLanguage);
  return isMultiLanguage(languages) ? buildLanguageLinkList(languages, { translations, ...options }) : '';
}

function buildLanguageLinkList(languages, { selectedLanguage, hrefPrefix, translations }){
  const triggerLabel = buildLanguageTriggerLabel(selectedLanguage, translations.multiLanguage);
  const customContent = `<span class="tn-screen-reader-only">${translations.currentLanguage}: ${triggerLabel}</span>`;
  const items = languages.map(lang => buildSettingsListItem({ lang, hrefPrefix, label: buildLanguageLabel(lang) }));
  items.unshift(buildSettingsListItem({ hrefPrefix, label: translations.multiLanguage }));
  return `
    <nav class="tn-settings-language">
      ${buildSettingsList({ items, triggerLabel, customContent, title: translations.availableLanguages })}
    </nav>
  `;
}

function buildLanguageTriggerLabel(selectedLanguage, multiLanguageLabel){
  return selectedLanguage ? buildLanguageLabel(selectedLanguage) : multiLanguageLabel;
}

function handleRSSFeed(languages, { selectedLanguage, hrefPrefix }){
  const translations = translationService.get(selectedLanguage);
  return isMultiLanguage(languages) ? buildRSSFeedLinkList(languages, { hrefPrefix, translations }) : buildRSSFeedLink(hrefPrefix, translations);
}

function buildRSSFeedLink(hrefPrefix = './', translations){
  return `<a href="${hrefPrefix}feed.atom">${translations.rssFeed}</a>`;
}

function buildRSSFeedLinkList(languages, { hrefPrefix, translations }){
  const filename = 'feed.atom';
  const items = languages.map(lang => buildSettingsListItem({ lang, hrefPrefix, filename, label: buildLanguageLabel(lang) }));
  items.unshift(buildSettingsListItem({ hrefPrefix, filename, label: translations.multiLanguage }));
  return buildSettingsList({ items, triggerLabel: translations.rssFeeds, title: translations.availableRSSFeeds });
}

function buildSettingsList({ items, triggerLabel, title, customContent = '' }){
  return `
    <div class="tn-settings-list-wrapper">
      <div class="tn-settings-list-container" tabindex="0">
        ${customContent}
        <span class="tn-settings-list-showing-trigger" aria-hidden="true">${triggerLabel}</span>
        <span class="tn-screen-reader-only">${title}:</span>
        <ul class="tn-settings-list">
          ${items.map(({ href, label }) => `<li><a href="${href}">${label}</a></li>`).join('')}
        </ul>
      </div>
      <button class="tn-settings-list-hiding-trigger" aria-hidden="true" tabindex="0">Close</button>
    </div>
  `;
}

function buildSettingsListItem({ lang, filename = '', hrefPrefix = './', label }){
  const baseHref = buildSettingsListItemBaseHref(hrefPrefix, lang);
  return { href: `${baseHref}${filename}`, label };
}

function buildSettingsListItemBaseHref(hrefPrefix, lang){
  const languageDirectory = lang ? `l/${lang}/` : '';
  return `${hrefPrefix}${languageDirectory}`;
}

function buildLanguageLabel(lang){
  const [code, countryCode] = lang.split('-');
  const name = LANGUAGES[code];
  return countryCode ? `${name} ${countryCode.toUpperCase()}` : name;
}

function isMultiLanguage(languages){
  return Array.isArray(languages) && languages.length > 1;
}

module.exports = _public;
