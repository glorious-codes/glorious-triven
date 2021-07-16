const path = require('path');
const assetsService = require('./assets');
const configService = require('./config');
const { fileService } = require('./file');
const minifyService = require('./minify');

describe('Assets Service', () => {
  beforeEach(() => {
    fileService.write = jest.fn();
    fileService.copySync = jest.fn();
    console.log = jest.fn();
    assetsService.flushCache();
  });

  function getMockFile(filename){
    const filepath = path.join(__dirname, `../mocks/${filename}`);
    const file = fileService.readSync(filepath);
    return { filepath, file };
  }

  it('should save an asset and return its hashed filename', () => {
    const { outputDirectory } = configService.get();
    const { filepath, file } = getMockFile('sample.css');
    assetsService.save(filepath);
    const expectedFilename = 'sample-971f848e8154ff6b2243ec1a1da4abc0.css';
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/a/${expectedFilename}`, minifyService.minifyCSS(file));
  });

  it('should copy an asset and return its hashed filename', () => {
    const { outputDirectory } = configService.get();
    const { filepath } = getMockFile('varejao.jpeg');
    assetsService.copy(filepath);
    const expectedFilename = 'varejao-a8774002d2f7fef27b27f665c7e7227c.jpeg';
    expect(fileService.copySync).toHaveBeenCalledWith(filepath, `${outputDirectory}/a/${expectedFilename}`);
  });

  it('should copy and minify a CSS asset and return its hashed filename', () => {
    const { outputDirectory } = configService.get();
    const { filepath, file } = getMockFile('sample.css');
    assetsService.copy(filepath);
    const expectedFilename = 'sample-971f848e8154ff6b2243ec1a1da4abc0.css';
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/a/${expectedFilename}`, minifyService.minifyCSS(file));
  });

  it('should copy and minify a JS asset and return its hashed filename', () => {
    const { outputDirectory } = configService.get();
    const { filepath, file } = getMockFile('sample.js');
    assetsService.copy(filepath);
    const expectedFilename = 'sample-20e917a9ac4a23e53b0a12f203a4a52c.js';
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/a/${expectedFilename}`, minifyService.minifyJS(file));
  });

  it('should return hashed asset filename without saving it if it has already been saved', () => {
    const { filepath } = getMockFile('sample.css');
    assetsService.save(filepath);
    expect(assetsService.save(filepath)).toEqual('sample-971f848e8154ff6b2243ec1a1da4abc0.css');
    expect(fileService.write).toHaveBeenCalledTimes(1);
  });
});
