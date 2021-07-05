const path = require('path');
const assetsService = require('./assets');
const configService = require('./config');
const { fileService } = require('./file');
const minifyService = require('./minify');

describe('Assets Service', () => {
  beforeEach(() => {
    fileService.write = jest.fn();
    console.log = jest.fn();
    assetsService.flushCache();
  });

  function getSampleAssetFile(){
    const filepath = path.join(__dirname, '../mocks/sample.css');
    const file = fileService.readSync(filepath);
    return { filepath, file };
  }

  it('should save an asset and return its hashed filename', () => {
    const { outputDirectory } = configService.get();
    const { filepath, file } = getSampleAssetFile();
    const filename = assetsService.save(filepath);
    const expectedFilename = 'sample-971f848e8154ff6b2243ec1a1da4abc0.css';
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/assets/${expectedFilename}`, minifyService.minifyCSS(file));
    expect(filename).toEqual(expectedFilename);
  });

  it('should return hashed asset filename without saving it if it has already been saved', () => {
    const { filepath } = getSampleAssetFile();
    assetsService.save(filepath);
    expect(assetsService.save(filepath)).toEqual('sample-971f848e8154ff6b2243ec1a1da4abc0.css');
    expect(fileService.write).toHaveBeenCalledTimes(1);
  });
});
