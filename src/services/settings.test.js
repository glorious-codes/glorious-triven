const domService = require('./dom');
const settingsService = require('./settings');

describe('Settings Service', () => {
  it('should build nothing if blog has been written in just one language', () => {
    expect(settingsService.build(['en-US'])).toEqual('');
  });

  it('should build language menu if blog has been written in more than one language', () => {
    const languages = ['en-US', 'pt-BR'];
    expect(settingsService.build(languages)).toEqual(domService.minifyHTML(`
      <div class="tn-settings">
        <div class="tn-settings-content">
          <nav class="tn-settings-language">
            <div class="tn-screen-reader-only">Current language: Multi-language</div>
            <button class="tn-settings-list-trigger" aria-hidden="true">
              Multi-language
            </button>
            <div class="tn-screen-reader-only">Available languages:</div>
            <ul class="tn-settings-list">
              <li>
                <a href="./">Multi-language</a>
              </li>
              <li>
                <a href="./l/en-US">English US</a>
              </li>
              <li>
                <a href="./l/pt-BR">Português BR</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    `));
  });

  it('should optionally show language trigger label according to selected language', () => {
    const languages = ['en-US', 'pt-BR'];
    expect(settingsService.build(languages, { selectedLanguage: 'pt-BR' })).toContain(domService.minifyHTML(`
      <button class="tn-settings-list-trigger" aria-hidden="true">
        Português BR
      </button>
    `));
  });

  it('should not show country code if it has not been specified', () => {
    const languages = ['en-US', 'pt'];
    const html = settingsService.build(languages, { selectedLanguage: 'pt' });
    expect(html).toContain(domService.minifyHTML(`
      <button class="tn-settings-list-trigger" aria-hidden="true">
        Português
      </button>
    `));
    expect(html).toContain(domService.minifyHTML(`
      <li>
        <a href="./l/pt">Português</a>
      </li>
    `));
  });

  it('should optionally set prefix for language link href', () => {
    const languages = ['en-US', 'pt-BR'];
    const hrefPrefix = '../../';
    expect(settingsService.build(languages, { hrefPrefix })).toContain(domService.minifyHTML(`
      <ul class="tn-settings-list">
        <li>
          <a href="../../">Multi-language</a>
        </li>
        <li>
          <a href="../../l/en-US">English US</a>
        </li>
        <li>
          <a href="../../l/pt-BR">Português BR</a>
        </li>
      </ul>
    `));
  });
});
