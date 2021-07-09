const path = require('path');
const configService = require('./config');
const { fileService } = require('./file');
const articleService = require('./article');

describe('Articles Service', () => {
  function mockTrivenConfig(){
    const config = {
      sourceDirectory: path.join(__dirname, '../mocks'),
      outputDirectory: path.join(process.cwd(), './triven')
    };
    configService.get = jest.fn(() => config);
    return config;
  }

  beforeEach(() => {
    fileService.copySync = jest.fn();
  });

  it('should copy relative images to assets directory and update its source in markup', () => {
    const { outputDirectory } = mockTrivenConfig();
    const filepath = path.join(__dirname, '../mocks/images.md');
    const { article } = articleService.build(filepath);
    const expectedFilename = 'varejao-a8774002d2f7fef27b27f665c7e7227c.jpeg';
    expect(article).toContain(`<img src="assets/${expectedFilename}" alt="Adriana Varejão Gallery">`);
    expect(fileService.copySync).toHaveBeenCalledTimes(1);
    expect(fileService.copySync).toHaveBeenCalledWith(
      `${path.join(__dirname, '../images/varejao.jpeg')}`,
      `${outputDirectory}/assets/${expectedFilename}`
    );
  });
});
