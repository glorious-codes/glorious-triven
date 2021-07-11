const domService = require('./dom');
const { fileService } = require('./file');
const stylesService = require('./styles');
const testingService = require('./testing');
const templateService = require('./template');

describe('Template Service', () => {
  const ASSETS_DIRNAME = 'assets';
  const { mockCustomTemplates } = testingService;

  function mount(act){
    stylesService.buildBaseStyle('', act);
  }

  beforeEach(() => {
    fileService.write = jest.fn();
    fileService.copySync = jest.fn();
    console.log = jest.fn();
  });

  it('should get default article template if no custom template has been found', done => {
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
          <link rel="stylesheet" href="assets/triven-967ef52e0a47578986ae49cff68b82ad.css">
        </head>
        <body>{{ triven:article }}</body>
      </html>
    `);
    mount(() => {
      expect(domService.minifyHTML(templateService.getArticleTemplate())).toEqual(expectedMarkup);
      done();
    });
  });

  it('should get default homepage template if no custom template has been found', done => {
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
          <link rel="stylesheet" href="assets/triven-967ef52e0a47578986ae49cff68b82ad.css">
          <title>Triven</title>
        </head>
        <body>{{ triven:posts }}</body>
      </html>
    `);
    mount(() => {
      expect(domService.minifyHTML(templateService.getHomepageTemplate())).toEqual(expectedMarkup);
      done();
    });
  });

  it('should get custom article template if template has been set', done => {
    mockCustomTemplates();
    const expectedMarkup = domService.minifyHTML(`
      <!DOCTYPE html>
      <html dir="ltr">
        <head>
          <link rel="stylesheet" href="assets/triven-967ef52e0a47578986ae49cff68b82ad.css">
        </head>
        <body>
          <h1>My Custom Article Title</h1>
          {{ triven:article }}
        </body>
      </html>
    `);
    mount(() => {
      expect(domService.minifyHTML(templateService.getArticleTemplate())).toEqual(expectedMarkup);
      done();
    });
  });

  it('should get custom homepage template if template has been set', done => {
    mockCustomTemplates();
    const expectedMarkup = domService.minifyHTML(`
      <!DOCTYPE html>
      <html lang="en-US" dir="ltr">
        <head>
          <link rel="stylesheet" href="assets/triven-967ef52e0a47578986ae49cff68b82ad.css">
        </head>
        <body>
          <h1>My Custom Homepage Title</h1>
          {{ triven:posts }}
        </body>
      </html>
    `);
    mount(() => {
      expect(domService.minifyHTML(templateService.getHomepageTemplate())).toEqual(expectedMarkup);
      done();
    });
  });

  it('should replace custom article template variables', done => {
    mockCustomTemplates({
      templates: {
        article: './src/templates/custom-article-vars.html',
        vars: {
          regularVar: '123',
          extraSpacedVar: '456',
          noSpaceVar: '789'
        }
      }
    });
    mount(() => {
      const template = templateService.getArticleTemplate();
      expect(template).toContain('<script>123</script>');
      expect(template).toContain('<script>456</script>');
      expect(template).toContain('<script>789</script>');
      done();
    });
  });

  it('should replace custom homepage template variables', done => {
    mockCustomTemplates({
      templates: {
        homepage: './src/templates/custom-homepage-vars.html',
        vars: {
          regularVar: '123',
          extraSpacedVar: '456',
          noSpaceVar: '789'
        }
      }
    });
    mount(() => {
      const template = templateService.getHomepageTemplate();
      expect(template).toContain('<script>123</script>');
      expect(template).toContain('<script>456</script>');
      expect(template).toContain('<script>789</script>');
      done();
    });
  });

  it('should copy relative images to assets directory and update its source in custom article template', done => {
    mockCustomTemplates({
      templates: {
        article: './src/templates/custom-article-assets.html'
      }
    });
    const filenames = {
      css: `${ASSETS_DIRNAME}/sample-971f848e8154ff6b2243ec1a1da4abc0.css`,
      favicon: `${ASSETS_DIRNAME}/favicon-080d0123f0f5493629646d0921301dfa.png`,
      appleFavicon: `${ASSETS_DIRNAME}/apple-favicon-fc5410abd7a0bafc18a9b40841869d97.png`,
      openGraph: `${ASSETS_DIRNAME}/logo-6b9a255106bdd43bf460d7a8e484903b.png`,
      image: `${ASSETS_DIRNAME}/varejao-a8774002d2f7fef27b27f665c7e7227c.jpeg`,
      script: `${ASSETS_DIRNAME}/sample-20e917a9ac4a23e53b0a12f203a4a52c.js`
    };
    mount(() => {
      const template = templateService.getArticleTemplate();
      expect(template).toContain(`<link href="${filenames.css}" rel="stylesheet">`);
      expect(template).toContain(`<link href="${filenames.favicon}" rel="icon" type="image/x-icon">`);
      expect(template).toContain(`<link href="${filenames.appleFavicon}" rel="apple-touch-icon">`);
      expect(template).toContain(`<meta content="${filenames.openGraph}" property="og:image">`);
      expect(template).toContain(`<img src="${filenames.image}">`);
      expect(template).toContain(`<script src="${filenames.script}" charset="utf-8"></script>`);
      done();
    });
  });

  it('should copy relative images to assets directory and update its source in custom homepage template', done => {
    mockCustomTemplates({
      templates: {
        homepage: './src/templates/custom-homepage-assets.html'
      }
    });
    const filenames = {
      css: `${ASSETS_DIRNAME}/sample-971f848e8154ff6b2243ec1a1da4abc0.css`,
      favicon: `${ASSETS_DIRNAME}/favicon-080d0123f0f5493629646d0921301dfa.png`,
      appleFavicon: `${ASSETS_DIRNAME}/apple-favicon-fc5410abd7a0bafc18a9b40841869d97.png`,
      openGraph: `${ASSETS_DIRNAME}/logo-6b9a255106bdd43bf460d7a8e484903b.png`,
      image: `${ASSETS_DIRNAME}/varejao-a8774002d2f7fef27b27f665c7e7227c.jpeg`,
      script: `${ASSETS_DIRNAME}/sample-20e917a9ac4a23e53b0a12f203a4a52c.js`
    };
    mount(() => {
      const template = templateService.getHomepageTemplate();
      expect(template).toContain(`<link href="${filenames.css}" rel="stylesheet">`);
      expect(template).toContain(`<link href="${filenames.favicon}" rel="icon" type="image/x-icon">`);
      expect(template).toContain(`<link href="${filenames.appleFavicon}" rel="apple-touch-icon">`);
      expect(template).toContain(`<meta content="${filenames.openGraph}" property="og:image">`);
      expect(template).toContain(`<img src="${filenames.image}">`);
      expect(template).toContain(`<script src="${filenames.script}" charset="utf-8"></script>`);
      done();
    });
  });

  it('should prefix local assets directory when handling assets for the second or more page of homepage', done => {
    mockCustomTemplates({
      templates: {
        homepage: './src/templates/custom-homepage-assets.html'
      }
    });
    const filenames = {
      css: `${ASSETS_DIRNAME}/sample-971f848e8154ff6b2243ec1a1da4abc0.css`
    };
    mount(() => {
      const template = templateService.getHomepageTemplate({ pageNumber: 2 });
      expect(template).toContain(`<link href="../${filenames.css}" rel="stylesheet">`);
      done();
    });
  });
});
