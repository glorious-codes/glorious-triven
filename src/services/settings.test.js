const domService = require('./dom');
const settingsService = require('./settings');
const { mockTrivenConfig } = require('./testing');

describe('Settings Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should show a RSS Feed link by default', () => {
    expect(settingsService.build()).toEqual(domService.minifyHTML(`
      <div class="tn-settings">
        <div class="tn-settings-content">
          <div class="tn-settings-rss-feed">
            <a href="./feed.atom">RSS Feed</a>
          </div>
        </div>
      </div>
    `));
  });

  it('should optionally set href prefix for RSS Feed link', () => {
    const languages = ['en-US'];
    const hrefPrefix = '../../';
    expect(settingsService.build(languages, { hrefPrefix })).toContain(domService.minifyHTML(`
      <div class="tn-settings">
        <div class="tn-settings-content">
          <div class="tn-settings-rss-feed">
            <a href="../../feed.atom">RSS Feed</a>
          </div>
        </div>
      </div>
    `));
  });

  it('should optionally show a RSS Feed link list if blog has been written in more than one language', () => {
    const languages = ['en-US', 'pt-BR'];
    expect(settingsService.build(languages)).toContain(domService.minifyHTML(`
      <div class="tn-settings-rss-feed">
        <div class="tn-settings-list-wrapper">
          <div class="tn-settings-list-container" tabindex="0">
            <span class="tn-settings-list-showing-trigger" aria-hidden="true">RSS Feeds</span>
            <span class="tn-screen-reader-only">Available RSS Feeds:</span>
            <ul class="tn-settings-list">
              <li>
                <a href="./feed.atom">Multi-language</a>
              </li>
              <li>
                <a href="./l/en-US/feed.atom">English US</a>
              </li>
              <li>
                <a href="./l/pt-BR/feed.atom">Português BR</a>
              </li>
            </ul>
          </div>
          <button class="tn-settings-list-hiding-trigger" aria-hidden="true" tabindex="0">
            Close
          </button>
        </div>
      </div>
    `));
  });

  it('should translate RSS Feed labels according to selected language', () => {
    const translations = {
      'pt-BR': {
        availableRSSFeeds: 'RSS Feeds disponíveis',
        multiLanguage: 'Multi-idiomas',
        rssFeeds: 'Feeds RSS'
      }
    };
    const languages = ['en-US', 'pt-BR'];
    mockTrivenConfig({ translations });
    const html = settingsService.build(languages, { selectedLanguage: languages[1] });
    expect(html).toContain(domService.minifyHTML(`
      <a href="./feed.atom">Multi-idiomas</a>
    `));
    expect(html).toContain(domService.minifyHTML(`
      <span class="tn-settings-list-showing-trigger" aria-hidden="true">Feeds RSS</span>
    `));
    expect(html).toContain(domService.minifyHTML(`
      <span class="tn-screen-reader-only">RSS Feeds disponíveis:</span>
    `));
  });

  it('should build language menu if blog has been written in more than one language', () => {
    const languages = ['en-US', 'pt-BR'];
    expect(settingsService.build(languages)).toContain(domService.minifyHTML(`
      <nav class="tn-settings-language">
        <div class="tn-settings-list-wrapper">
          <div class="tn-settings-list-container" tabindex="0">
            <span class="tn-screen-reader-only">Current language: Multi-language</span>
            <span class="tn-settings-list-showing-trigger" aria-hidden="true">Multi-language</span>
            <span class="tn-screen-reader-only">Available languages:</span>
            <ul class="tn-settings-list">
              <li>
                <a href="./">Multi-language</a>
              </li>
              <li>
                <a href="./l/en-US/">English US</a>
              </li>
              <li>
                <a href="./l/pt-BR/">Português BR</a>
              </li>
            </ul>
          </div>
          <button class="tn-settings-list-hiding-trigger" aria-hidden="true" tabindex="0">
            Close
          </button>
        </div>
      </nav>
    `));
  });

  it('should optionally show language trigger label according to selected language', () => {
    const languages = ['en-US', 'pt-BR'];
    expect(settingsService.build(languages, { selectedLanguage: 'pt-BR' })).toContain(domService.minifyHTML(`
      <span class="tn-settings-list-showing-trigger" aria-hidden="true">
        Português BR
      </span>
    `));
  });

  it('should not show country code if it has not been specified', () => {
    const languages = ['en-US', 'pt'];
    const html = settingsService.build(languages, { selectedLanguage: 'pt' });
    expect(html).toContain(domService.minifyHTML(`
      <span class="tn-settings-list-showing-trigger" aria-hidden="true">
        Português
      </span>
    `));
    expect(html).toContain(domService.minifyHTML(`
      <li>
        <a href="./l/pt/">Português</a>
      </li>
    `));
  });

  it('should optionally set href prefix for language links', () => {
    const languages = ['en-US', 'pt-BR'];
    const hrefPrefix = '../../';
    expect(settingsService.build(languages, { hrefPrefix })).toContain(domService.minifyHTML(`
      <ul class="tn-settings-list">
        <li>
          <a href="../../">Multi-language</a>
        </li>
        <li>
          <a href="../../l/en-US/">English US</a>
        </li>
        <li>
          <a href="../../l/pt-BR/">Português BR</a>
        </li>
      </ul>
    `));
  });

  it('should translate language labels according to selected language', () => {
    const translations = {
      'pt-BR': {
        availableLanguages: 'Idiomas disponíveis',
        currentLanguage: 'Idioma selecionado',
        multiLanguage: 'Multi-idiomas'
      }
    };
    const languages = ['en-US', 'pt-BR'];
    mockTrivenConfig({ translations });
    const html = settingsService.build(languages, { selectedLanguage: languages[1] });
    expect(html).toContain(domService.minifyHTML(`
      <span class="tn-screen-reader-only">Idioma selecionado: Português BR</span>
    `));
    expect(html).toContain(domService.minifyHTML(`
      <a href="./">Multi-idiomas</a>
    `));
    expect(html).toContain(domService.minifyHTML(`
      <span class="tn-screen-reader-only">Idiomas disponíveis:</span>
    `));
  });
});
