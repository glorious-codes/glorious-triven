const postsMock = require('../mocks/posts');
const configService = require('./config');
const domService = require('./dom');
const { fileService } = require('./file');
const pageService = require('./page');
const stylesService = require('./styles');

describe('Page Service', () => {
  function buildPage(posts, { page, total }, onBuild){
    stylesService.buildBaseStyle('', () => {
      const result = pageService.build(posts, { page, total });
      onBuild(result);
    });
  }

  function parsePostHref(href){
    return href.replace('.html', '');
  }

  function getExpectedTrivenStylesheetHash(){
    return '967ef52e0a47578986ae49cff68b82ad';
  }

  beforeEach(() => {
    fileService.write = jest.fn();
    fileService.copySync = jest.fn();
    console.log = jest.fn();
  });

  it('should build a page containing given posts', done => {
    configService.get = jest.fn(() => ({ title: 'Test Blog' }));
    const [first, second, third] = postsMock;
    buildPage([first, second, third], { page: 1, total: 1 }, page => {
      expect(page).toEqual(domService.minifyHTML(`
        <!DOCTYPE html>
        <html lang="en-US" dir="ltr">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
            <meta http-equiv="cache-control" content="no-cache">
            <meta http-equiv="cache-control" content="max-age=0">
            <meta http-equiv="expires" content="0">
            <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
            <meta http-equiv="pragma" content="no-cache">
            <link rel="stylesheet" href="assets/triven-${getExpectedTrivenStylesheetHash()}.css">
            <title>Test Blog</title>
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
                  <section>
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

  it('should contain a prefixed base stylesheet linked in the html head if page is greater than one', done => {
    buildPage(postsMock, { page: 2, total: 2 }, page => {
      expect(page).toContain(domService.minifyHTML(`
        <link rel="stylesheet" href="../assets/triven-${getExpectedTrivenStylesheetHash()}.css">
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
            <a href="../" class="tn-newer-link">Newer</a>
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
            <a href="2" class="tn-newer-link">Newer</a>
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
      expect(page).toContain('<a href="2" class="tn-newer-link">Newer</a>');
      expect(page).toContain('<a href="4" class="tn-older-link">Older</a>');
      done();
    });
  });

  it('should build apropriate post href on pages other than the first one', done => {
    const [first] = postsMock;
    const expectedHref = `../${parsePostHref(first.url)}`;
    buildPage([first], { page: 2, total: 2 }, page => {
      expect(page).toContain(`<h2 class="tn-post-title"><a href="${expectedHref}">${first.title}</a></h2>`);
      expect(page).toContain(`<a href="${expectedHref}" class="tn-read-more-link">Read more</a>`);
      done();
    });
  });

  it('should build apropriate external post href on pages other than the first one', done => {
    const second = postsMock[1];
    buildPage([second], { page: 2, total: 2 }, page => {
      expect(page).toContain(`<h2 class="tn-post-title"><a href="${second.url}" rel="noopener noreferrer" target="_blank">${second.title}</a></h2>`);
      expect(page).toContain(`<a href="${second.url}" rel="noopener noreferrer" target="_blank" class="tn-read-more-link">Read more</a>`);
    });
    done();
  });
});
