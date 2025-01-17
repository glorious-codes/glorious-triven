const fs = require('fs');
const path = require('path');
const articleService = require('./article');
const assetsService = require('./assets');
const { fileService } = require('./file');
const configService = require('./config');
const dateService = require('./date');
const domService = require('./dom');
const homepageService = require('./homepage');
const postsService = require('./posts');
const { mockTrivenConfig, getExpectedTrivenStylesheetHash } = require('./testing');
const buildService = require('./build');

describe('Build Service', () => {
  function buildPathToMarkdownMock(filename = 'new-year.md'){
    return path.join(__dirname, `../mocks/${filename}`);
  }

  beforeEach(() => {
    console.log = jest.fn();
    fileService.write = jest.fn((path, data, onSuccess) => onSuccess && onSuccess());
    fileService.copySync = jest.fn();
    homepageService.build = jest.fn();
  });

  afterEach(() => {
    assetsService.flushCache();
  });

  it('should create a demo post if no markdown files have been found on source directory', done => {
    fileService.collect = jest.fn((pattern, onSuccess) => {
      const filepaths = fileService.collect.mock.calls.length === 1 ? [] : [buildPathToMarkdownMock()];
      onSuccess(filepaths);
    });
    const post = fs.readFileSync(path.join(__dirname, '../templates/introducing-triven.md'), 'utf-8');
    const date = dateService.buildTodayISODate();
    const { sourceDirectory } = configService.get();
    buildService.init(() => {
      expect(console.log).toHaveBeenCalledWith('Building files...');
      expect(fileService.collect).toHaveBeenCalledWith(`${sourceDirectory}/**/*.md`, expect.any(Function));
      expect(fileService.write).toHaveBeenCalledWith(`${sourceDirectory}/introducing-triven.md`, post.replace('{date}', date), expect.any(Function));
      expect(console.log).toHaveBeenCalledWith('Files successfully built!');
      done();
    });
  });

  it('should convert markdown files to html files if markdown files have been found on source directory', done => {
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess([buildPathToMarkdownMock()]));
    const data = domService.minifyHTML(`
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <link rel="stylesheet" href="../a/triven-${getExpectedTrivenStylesheetHash()}.css">
    <title>New year!</title>
    <meta name="description" content="This is a simple description." />
    <meta name="keywords" content="new year, réveillon" />
    <meta name="twitter:card" content="summary">
    <meta property="og:title" content="New year!" />
    <meta property="og:description" content="This is a simple description." />
  </head>
  <body>
    <main class="tn-main">
      <article class="tn-article" itemscope itemtype="http://schema.org/BlogPosting">
        <header class="tn-header">
          <h1 class="tn-post-title">New year!</h1>
          <time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2022-01-01">
            1/1/2022
          </time>
        </header>
        <p>Happy new year!</p>
        <h2>What to do next</h2>
        <p>I don't know</p>
        <h3>Really?</h3>
        <p>Yes.</p>
        <footer class="tn-footer">
          <a href="../">See all posts</a>
        </footer>
      </article>
    </main>
  </body>
</html>
`.trim());
    const { sourceDirectory, outputDirectory } = configService.get();
    buildService.init(() => {
      expect(fileService.write).not.toHaveBeenCalledWith(`${sourceDirectory}/hello-world.md`, expect.any(String));
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/new-year/index.html`, data);
      done();
    });
  });

  it('should optionally set an image for the article', done => {
    mockTrivenConfig({ url: 'https://rafaelcamargo.com/blog' });
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess([buildPathToMarkdownMock('social-image-article.md')]));
    const data = domService.minifyHTML(`
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <link rel="stylesheet" href="../a/triven-${getExpectedTrivenStylesheetHash()}.css">
    <title>Social Image Article</title>
    <meta name="description" content="This is a sample article featuring a social image." />
    <meta name="keywords" content="article, social, image" />
    <meta name="twitter:card" content="summary">
    <meta property="og:title" content="Social Image Article" />
    <meta property="og:description" content="This is a sample article featuring a social image." />
    <meta name="twitter:image" content="https://rafaelcamargo.com/blog/a/social-image-3c01781393bb06e25f224a87d0d3dbb7.png" />
    <meta property="og:image" content="https://rafaelcamargo.com/blog/a/social-image-3c01781393bb06e25f224a87d0d3dbb7.png" />
  </head>
  <body>
    <main class="tn-main">
      <article class="tn-article" itemscope itemtype="http://schema.org/BlogPosting">
        <header class="tn-header">
          <h1 class="tn-post-title">Social Image Article</h1>
          <time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2025-01-17">
            1/17/2025
          </time>
        </header>
        <p>Trying out an optional social image.</p>
        <p>
          <img src="../a/social-image-3c01781393bb06e25f224a87d0d3dbb7.png" alt="social image" />
        </p>
        <footer class="tn-footer">
          <a href="../">See all posts</a>
        </footer>
      </article>
    </main>
  </body>
</html>
`).trim();
    const { outputDirectory } = configService.get();
    buildService.init(() => {
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/social-image-article/index.html`, data);
      done();
    });
  });

  it('should optionally set an image alt for the article', done => {
    mockTrivenConfig({ url: 'https://rafaelcamargo.com/blog' });
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess([buildPathToMarkdownMock('social-image-alt-article.md')]));
    const data = domService.minifyHTML(`
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <link rel="stylesheet" href="../a/triven-${getExpectedTrivenStylesheetHash()}.css">
    <title>Social Image Alt Article</title>
    <meta name="description" content="This is a sample article featuring a social alt image." />
    <meta name="keywords" content="article, social, alt image" />
    <meta name="twitter:card" content="summary">
    <meta property="og:title" content="Social Image Alt Article" />
    <meta property="og:description" content="This is a sample article featuring a social alt image." />
    <meta name="twitter:image" content="https://rafaelcamargo.com/blog/a/social-image-3c01781393bb06e25f224a87d0d3dbb7.png" />
    <meta property="og:image" content="https://rafaelcamargo.com/blog/a/social-image-3c01781393bb06e25f224a87d0d3dbb7.png" />
    <meta property="og:image:alt" content="The text social image in white on a black background" />
  </head>
  <body>
    <main class="tn-main">
      <article class="tn-article" itemscope itemtype="http://schema.org/BlogPosting">
        <header class="tn-header">
          <h1 class="tn-post-title">Social Image Alt Article</h1>
          <time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2025-01-17">
            1/17/2025
          </time>
        </header>
        <p>Trying out an optional social alt image.</p>
        <footer class="tn-footer">
          <a href="../">See all posts</a>
        </footer>
      </article>
    </main>
  </body>
</html>
`).trim();
    const { outputDirectory } = configService.get();
    buildService.init(() => {
      expect(fileService.copySync).toHaveBeenCalledWith(path.join(__dirname, '../mocks/social-image.png'), `${outputDirectory}/a/social-image-3c01781393bb06e25f224a87d0d3dbb7.png`);
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/social-image-alt-article/index.html`, data);
      done();
    });
  });

  it('should optionally use a custom article template', done => {
    mockTrivenConfig({
      templates: {
        article: './src/mocks/custom-article.html'
      }
    });
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess([buildPathToMarkdownMock()]));
    const data = domService.minifyHTML(`
<!DOCTYPE html>
<html dir="ltr" lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5">
    <link rel="stylesheet" href="../a/triven-${getExpectedTrivenStylesheetHash()}.css">
    <title>New year!</title>
    <meta name="description" content="This is a simple description.">
    <meta name="keywords" content="new year, réveillon">
    <meta name="twitter:card" content="summary">
    <meta property="og:title" content="New year!">
    <meta property="og:description" content="This is a simple description.">
  </head>
  <body>
    <header>Custom Article Header</header>
    <main class="tn-main">
      <article class="tn-article" itemscope itemtype="http://schema.org/BlogPosting">
        <header class="tn-header">
          <h1 class="tn-post-title">New year!</h1>
          <time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2022-01-01">
            1/1/2022
          </time>
        </header>
        <p>Happy new year!</p>
        <h2>What to do next</h2>
        <p>I don't know</p>
        <h3>Really?</h3>
        <p>Yes.</p>
        <footer class="tn-footer">
          <a href="../">See all posts</a>
        </footer>
      </article>
    </main>
  </body>
</html>
`.trim());
    const { outputDirectory } = configService.get();
    buildService.init(() => {
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/new-year/index.html`, data);
      done();
    });
  });

  it('should optionally customize article footer', done => {
    mockTrivenConfig({
      templates: {
        article: './src/mocks/custom-footer-article.html'
      }
    });
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess([buildPathToMarkdownMock()]));
    const data = domService.minifyHTML(`
<!DOCTYPE html>
<html dir="ltr" lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5">
    <link rel="stylesheet" href="../a/triven-${getExpectedTrivenStylesheetHash()}.css">
    <title>New year!</title>
    <meta name="description" content="This is a simple description.">
    <meta name="keywords" content="new year, réveillon">
    <meta name="twitter:card" content="summary">
    <meta property="og:title" content="New year!">
    <meta property="og:description" content="This is a simple description.">
  </head>
  <body>
    <header>Wrapping footer</header>
    <main class="tn-main">
      <article class="tn-article" itemscope itemtype="http://schema.org/BlogPosting">
        <header class="tn-header">
          <h1 class="tn-post-title">New year!</h1>
          <time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2022-01-01">
            1/1/2022
          </time>
        </header>
        <p>Happy new year!</p>
        <h2>What to do next</h2>
        <p>I don't know</p>
        <h3>Really?</h3>
        <p>Yes.</p>
      </article>
    </main>
    <div>Content between post and navigation</div>
    <div class="custom-footer">
      <footer class="tn-footer">
        <a href="../">See all posts</a>
      </footer>
    </div>
  </body>
</html>
`.trim());
    const { outputDirectory } = configService.get();
    buildService.init(() => {
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/new-year/index.html`, data);
      done();
    });
  });

  it('should not save an html file to article if it is an external article', done => {
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess([path.join(__dirname, '../mocks/external-article.md')]));
    const { outputDirectory } = configService.get();
    buildService.init(() => {
      expect(fileService.write).not.toHaveBeenCalledWith(`${outputDirectory}/external-article/index.html`, expect.any(String));
      done();
    });
  });

  it('should build homepage', done => {
    const filepaths = [buildPathToMarkdownMock()];
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess(filepaths));
    const { outputDirectory } = configService.get();
    const [postData] = postsService.buildData(filepaths);
    const { summary } = articleService.build(postData);
    buildService.init(() => {
      expect(homepageService.build).toHaveBeenCalledWith([summary], outputDirectory);
      done();
    });
  });

  it('should save a JSON containing all post summaries', done => {
    const filepaths = [buildPathToMarkdownMock()];
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess(filepaths));
    const { outputDirectory } = configService.get();
    const [postData] = postsService.buildData(filepaths);
    const { summary } = articleService.build(postData);
    buildService.init(() => {
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/posts.json`, JSON.stringify([summary]));
      done();
    });
  });
});
