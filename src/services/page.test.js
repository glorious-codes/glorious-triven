const postsMock = require('../mocks/posts');
const domService = require('./dom');
const { fileService } = require('./file');
const pageService = require('./page');
const stylesService = require('./styles');
const { mockTrivenConfig } = require('./testing');

describe('Page Service', () => {
  function buildPage(posts, { page, total, hrefPrefixes, lang, availableLanguages }, onBuild){
    stylesService.buildBaseStyle('', () => {
      const result = pageService.build(posts, { page, total, hrefPrefixes, lang, availableLanguages });
      onBuild(result);
    });
  }

  function getExpectedTrivenStylesheetHash(){
    return 'dae25b1d252923eff2af458404e045dd';
  }

  beforeEach(() => {
    fileService.write = jest.fn();
    fileService.copySync = jest.fn();
  });

  it('should build a page containing given posts', done => {
    const title = 'Test Blog';
    mockTrivenConfig({ title });
    const [first, second, third] = postsMock;
    buildPage([first, second, third], { page: 1, total: 1 }, page => {
      expect(page).toEqual(domService.minifyHTML(`
        <!DOCTYPE html>
        <html lang="en-US">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
            <link rel="stylesheet" href="a/triven-${getExpectedTrivenStylesheetHash()}.css">
            <title>${title}</title>
          </head>
          <body>
            <main class="tn-main">
              <ul class="tn-post-list">
                <li>
                  <section>
                    <header class="tn-header">
                      <h2 class="tn-post-title"><a href="new-year">New year!</a></h2>
                      <p class="tn-date">1/1/2020</p>
                    </header>
                    <p>This is an excerpt for the first post</p>
                    <footer class="tn-footer">
                      <a href="new-year" class="tn-read-more-link">
                        Read more
                      </a>
                    </footer>
                  </section>
                </li>
                <li>
                  <section>
                    <header class="tn-header">
                      <h2 class="tn-post-title">
                        <a href="https://rafaelcamargo.com/the-pearl-and-the-mussels" rel="noopener noreferrer" target="_blank">
                          The pearl and the mussels
                        </a>
                      </h2>
                      <p class="tn-date">6/21/2021</p>
                    </header>
                    <p>This is an excerpt for the second post</p>
                    <footer class="tn-footer">
                    <a href="https://rafaelcamargo.com/the-pearl-and-the-mussels" rel="noopener noreferrer" target="_blank" class="tn-read-more-link">
                      Read more
                    </a>
                    </footer>
                  </section>
                </li>
                <li>
                  <section lang="pt-BR">
                    <header class="tn-header">
                      <h2 class="tn-post-title">
                        <a href="https://rafaelcamargo.com/incondicional-inhotim" rel="noopener noreferrer" target="_blank">
                          Incondicional Inhotim
                        </a>
                      </h2>
                      <p class="tn-date">28/06/2020</p>
                    </header>
                    <p>Esse é um excerto para o terceiro artigo.</p>
                    <footer class="tn-footer">
                      <a href="https://rafaelcamargo.com/incondicional-inhotim" rel="noopener noreferrer" target="_blank" class="tn-read-more-link">
                        Read more
                      </a>
                    </footer>
                  </section>
                </li>
              </ul>
            </main>
          </body>
        </html>
      `));
      done();
    });
  });

  it('should optionally prefix assets href in the html', done => {
    const hrefPrefixes = { asset: '../../../../' };
    buildPage(postsMock, { page: 2, total: 2, hrefPrefixes }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <link rel="stylesheet" href="../../../../a/triven-${getExpectedTrivenStylesheetHash()}.css">
      `));
      done();
    });
  });

  it('should optionally prefix post href in the html', done => {
    const hrefPrefixes = { post: '../../../../' };
    buildPage(postsMock, { page: 2, total: 2, hrefPrefixes }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <h2 class="tn-post-title">
          <a href="../../../../new-year">New year!</a>
        </h2>
      `));
      expect(page).toContain(domService.minifyHTML(`
        <footer class="tn-footer">
          <a href="../../../../new-year" class="tn-read-more-link">
            Read more
          </a>
        </footer>
      `));
      done();
    });
  });

  it('should contain a link to index if current page is two', done => {
    const [first, second] = postsMock;
    buildPage([first, second], { page: 2, total: 2 }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <footer class="tn-footer">
          <nav>
            <a href="../../" class="tn-newer-link">Newer</a>
          </nav>
        </footer>
      `));
      done();
    });
  });

  it('should contain a link to newer posts if page number given is greater than two', done => {
    const [first, second] = postsMock;
    buildPage([first, second], { page: 3, total: 3 }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <footer class="tn-footer">
          <nav>
            <a href="../2" class="tn-newer-link">Newer</a>
          </nav>
        </footer>
      `));
      done();
    });
  });

  it('should contain a link to older posts if number of total pages is greater than current page', done => {
    const [first, second] = postsMock;
    buildPage([first, second], { page: 1, total: 2 }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <footer class="tn-footer">
          <nav>
            <a href="p/2" class="tn-older-link">Older</a>
          </nav>
        </footer>
      `));
      done();
    });
  });

  it('should contain a link to newer and older posts if page is between the first and last one', done => {
    const [first, second] = postsMock;
    buildPage([first, second], { page: 3, total: 6 }, page => {
      expect(page).toContain('<a href="../2" class="tn-newer-link">Newer</a>');
      expect(page).toContain('<a href="../4" class="tn-older-link">Older</a>');
      done();
    });
  });

  it('should build apropriate external post href on pages other than the first one', done => {
    const second = postsMock[1];
    buildPage([second], { page: 2, total: 2 }, page => {
      expect(page).toContain(`<h2 class="tn-post-title"><a href="${second.url}" rel="noopener noreferrer" target="_blank">${second.title}</a></h2>`);
      expect(page).toContain(`<a href="${second.url}" rel="noopener noreferrer" target="_blank" class="tn-read-more-link">Read more</a>`);
      done();
    });
  });

  it('should set page language according to the language set on triven config file by default', done => {
    const lang = 'pt-BR';
    mockTrivenConfig({ lang });
    buildPage(postsMock, { page: 1, total: 1 }, page => {
      expect(page).toContain(`<html lang="${lang}">`);
      done();
    });
  });

  it('should optionally set language other than language set on triven config file', done => {
    const lang = 'pt-BR';
    const customLang = 'es-ES';
    mockTrivenConfig({ lang });
    buildPage(postsMock, { page: 1, total: 1, lang: customLang }, page => {
      expect(page).toContain(`<html lang="${lang}">`);
      done();
    });
  });

  it('should optionally use custom translations for labels', done => {
    const lang = 'pt-BR';
    const newer = 'Posteriores';
    const older = 'Anteriores';
    mockTrivenConfig({ translations: { [lang]: { newer, older } } });
    buildPage(postsMock, { page: 3, total: 6, lang }, page => {
      expect(page).toContain(`<a href="../2" class="tn-newer-link">${newer}</a>`);
      expect(page).toContain(`<a href="../4" class="tn-older-link">${older}</a>`);
      done();
    });
  });

  it('should optionally use custom translations for "Read more" links', done => {
    mockTrivenConfig({ translations: { 'pt-BR': { readMore: 'Continue lendo' } } });
    buildPage(postsMock, { page: 1, total: 1 }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <a href="new-year" class="tn-read-more-link">
          Read more
        </a>
      `));
      expect(page).toContain(domService.minifyHTML(`
        <a href="https://rafaelcamargo.com/incondicional-inhotim" rel="noopener noreferrer" target="_blank" class="tn-read-more-link">
          Continue lendo
        </a>
      `));
      done();
    });
  });

  it('should build language settings menu if more than one language is available', done => {
    const hrefPrefixes = { post: '../../../../' };
    const availableLanguages = ['en-US', 'es-ES'];
    buildPage(postsMock, { page: 2, total: 2, hrefPrefixes, availableLanguages }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <div class="tn-settings">
          <div class="tn-settings-content">
            <nav class="tn-settings-language">
              <div class="tn-settings-list-container" tabindex="0">
                <span class="tn-screen-reader-only">Current language: Multi-language</span>
                <span class="tn-settings-list-trigger" aria-hidden="true">Multi-language</span>
                <span class="tn-screen-reader-only">Available languages:</span>
                <ul class="tn-settings-list">
                  <li>
                    <a href="../../../../">Multi-language</a>
                  </li>
                  <li>
                    <a href="../../../../l/en-US">English US</a>
                  </li>
                  <li>
                    <a href="../../../../l/es-ES">Español ES</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      `));
      done();
    });
  });
});
