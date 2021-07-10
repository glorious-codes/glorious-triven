const configService = require('./config');
const domService = require('./dom');
const { fileService } = require('./file');
const templateService = require('./template');

describe('Template Service', () => {
  function mockConfig(config){
    configService.flush();
    const filesMock = {
      [`${process.cwd()}/triven.config`]: config
    };
    fileService.require = jest.fn(filepath => filesMock[filepath]);
  }

  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should get default article template if no custom template has been found', () => {
    const expectedMarkup = domService.minifyHTML(`
      <!DOCTYPE html>
      <html dir="ltr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
          <meta http-equiv="cache-control" content="no-cache">
          <meta http-equiv="cache-control" content="max-age=0">
          <meta http-equiv="expires" content="0">
          <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
          <meta http-equiv="pragma" content="no-cache">
        </head>
        <body>{{article}}</body>
      </html>
    `);
    expect(domService.minifyHTML(templateService.getArticleTemplate())).toEqual(expectedMarkup);
  });

  it('should get default homepage template if no custom template has been found', () => {
    const expectedMarkup = domService.minifyHTML(`
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
          <title>Triven</title>
        </head>
        <body>{{posts}}</body>
      </html>
    `);
    expect(domService.minifyHTML(templateService.getHomepageTemplate())).toEqual(expectedMarkup);
  });

  it('should get custom article template if template has been set', () => {
    mockConfig({
      templates: {
        article: './src/templates/custom-article.html'
      }
    });
    const expectedMarkup = domService.minifyHTML(`
      <!DOCTYPE html>
      <html dir="ltr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
          <meta http-equiv="cache-control" content="no-cache">
          <meta http-equiv="cache-control" content="max-age=0">
          <meta http-equiv="expires" content="0">
          <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
          <meta http-equiv="pragma" content="no-cache">
        </head>
        <body>
          <h1>My Custom Article Title</h1>
          {{article}}
        </body>
      </html>
    `);
    expect(domService.minifyHTML(templateService.getArticleTemplate())).toEqual(expectedMarkup);
  });

  it('should get custom homepage template if template has been set', () => {
    mockConfig({
      templates: {
        homepage: './src/templates/custom-homepage.html'
      }
    });
    const expectedMarkup = domService.minifyHTML(`
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
        </head>
        <body>
          <h1>My Custom Homepage Title</h1>
          {{posts}}
        </body>
      </html>
    `);
    expect(domService.minifyHTML(templateService.getHomepageTemplate())).toEqual(expectedMarkup);
  });
});
