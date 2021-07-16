const path = require('path');
const configService = require('./config');
const { fileService } = require('./file');
const articleService = require('./article');

describe('Articles Service', () => {
  beforeEach(() => {
    fileService.write = jest.fn();
    fileService.copySync = jest.fn();
    console.log = jest.fn();
  });

  it('should copy relative images to assets directory and update its source in markup', () => {
    const { outputDirectory } = configService.get();
    const filepath = path.join(__dirname, '../mocks/images.md');
    const { article } = articleService.build(filepath);
    const expectedFilename = 'varejao-a8774002d2f7fef27b27f665c7e7227c.jpeg';
    expect(article).toContain(`<img src="../a/${expectedFilename}" alt="Adriana Varejão Gallery">`);
    expect(fileService.copySync).toHaveBeenCalledWith(
      `${path.join(__dirname, '../mocks/varejao.jpeg')}`,
      `${outputDirectory}/a/${expectedFilename}`
    );
  });
});
