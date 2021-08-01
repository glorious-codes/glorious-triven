const path = require('path');
const configService = require('./config');
const { fileService } = require('./file');
const postsService = require('./posts');
const articleService = require('./article');

describe('Articles Service', () => {
  beforeEach(() => {
    fileService.write = jest.fn();
    fileService.copySync = jest.fn();
    console.log = jest.fn();
  });

  it('should copy relative images to assets directory and update its source in markup', () => {
    const filepaths = [path.join(__dirname, '../mocks/images.md')];
    const { outputDirectory } = configService.get();
    const [postData] = postsService.buildData(filepaths);
    const { article } = articleService.build(postData);
    const expectedFilename = 'varejao-a8774002d2f7fef27b27f665c7e7227c.jpeg';
    expect(article).toContain(`<img src="../a/${expectedFilename}" alt="Adriana Varejão Gallery">`);
    expect(fileService.copySync).toHaveBeenCalledWith(
      `${path.join(__dirname, '../mocks/varejao.jpeg')}`,
      `${outputDirectory}/a/${expectedFilename}`
    );
  });

  it('should See All Posts link point to root if blog contains just one language', () => {
    const filepaths = [path.join(__dirname, '../mocks/images.md')];
    const [postData] = postsService.buildData(filepaths);
    const { article } = articleService.build(postData, ['en-US']);
    expect(article).toContain('<a href="../">See all posts</a>');
  });

  it('should See All Posts link point to language-specif homepage if blog contains more than one language', () => {
    const filepaths = [path.join(__dirname, '../mocks/images.md')];
    const [postData] = postsService.buildData(filepaths);
    const { article } = articleService.build(postData, ['en-US', 'pt-BR']);
    expect(article).toContain('<a href="../l/en-US">See all posts</a>');
  });
});
