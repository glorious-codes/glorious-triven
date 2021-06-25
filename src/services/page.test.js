const postsMock = require('../mocks/posts');
const configService = require('./config');
const domService = require('./dom');
const pageService = require('./page');

describe('Page Service', () => {
  function parsePostHref(href){
    return href.replace('.html', '');
  }

  it('should build a page containing given posts', () => {
    configService.get = jest.fn(() => ({ title: 'Test Blog' }));
    const [first, second, third] = postsMock;
    expect(pageService.build([first, second, third], 1)).toEqual(domService.minifyHTML(`
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
          <title>Test Blog</title>
        </head>
        <body>
          <main>
            <ul>
              <li>
                <section>
                  <header>
                    <a href="new-year">
                      <h2>New year!</h2>
                    </a>
                    <p>1/1/2020</p>
                  </header>
                  <p>This is an excerpt for the first post</p>
                  <a href="new-year">
                    Read more
                  </a>
                </section>
              </li>
              <li>
                <section>
                  <header>
                    <a href="https://rafaelcamargo.com/the-pearl-and-the-mussels" rel="noopener noreferrer" target="_blank">
                      <h2>The pearl and the mussels</h2>
                    </a>
                    <p>6/21/2021</p>
                  </header>
                  <p>This is an excerpt for the second post</p>
                  <a href="https://rafaelcamargo.com/the-pearl-and-the-mussels" rel="noopener noreferrer" target="_blank">
                    Read more
                  </a>
                </section>
              </li>
              <li>
                <section>
                  <header>
                    <a href="https://rafaelcamargo.com/incondicional-inhotim" rel="noopener noreferrer" target="_blank">
                      <h2>Incondicional Inhotim</h2>
                    </a>
                    <p>28/06/2020</p>
                  </header>
                  <p>Esse é um excerto para o terceiro artigo.</p>
                  <a href="https://rafaelcamargo.com/incondicional-inhotim" rel="noopener noreferrer" target="_blank">
                    Read more
                  </a>
                </section>
              </li>
            </ul>
          </main>
        </body>
      </html>
    `));
  });

  it('should contain a link to index if current page is two', () => {
    const [first, second] = postsMock;
    const page = pageService.build([first, second], { page: 2, total: 2 });
    expect(page).toContain(domService.minifyHTML(`
      <footer>
        <nav>
          <a href="../">Previous</a>
        </nav>
      </footer>
    `));
  });

  it('should contain a link to newer posts if page number given is greater than two', () => {
    const [first, second] = postsMock;
    const page = pageService.build([first, second], { page: 3, total: 3 });
    expect(page).toContain(domService.minifyHTML(`
      <footer>
        <nav>
          <a href="2">Previous</a>
        </nav>
      </footer>
    `));
  });

  it('should contain a link to older posts if number of total pages is greater than current page', () => {
    const [first, second] = postsMock;
    const page = pageService.build([first, second], { page: 1, total: 2 });
    expect(page).toContain(domService.minifyHTML(`
      <footer>
        <nav>
          <a href="p/2">Next</a>
        </nav>
      </footer>
    `));
  });

  it('should contain a link to newer and older posts if page is between the first and last one', () => {
    const [first, second] = postsMock;
    const page = pageService.build([first, second], { page: 3, total: 6 });
    expect(page).toContain('<a href="2">Previous</a>');
    expect(page).toContain('<a href="4">Next</a>');
  });

  it('should build apropriate post href on pages other than the first one', () => {
    const [first] = postsMock;
    const page = pageService.build([first], { page: 2, total: 2 });
    const expectedHref = `../${parsePostHref(first.url)}`;
    expect(page).toContain(`<a href="${expectedHref}"><h2>${first.title}</h2></a>`);
    expect(page).toContain(`<a href="${expectedHref}">Read more</a>`);
  });

  it('should build apropriate external post href on pages other than the first one', () => {
    const second = postsMock[1];
    const page = pageService.build([second], { page: 2, total: 2 });
    expect(page).toContain(`<a href="${second.url}" rel="noopener noreferrer" target="_blank"><h2>${second.title}</h2></a>`);
    expect(page).toContain(`<a href="${second.url}" rel="noopener noreferrer" target="_blank">Read more</a>`);
  });
});
