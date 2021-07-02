const { fileService } = require('./file');
const configService = require('./config');

describe('Config Service', () => {
  function stubRequire(config){
    const files = {
      [`${process.cwd()}/triven.config`]: config
    };
    fileService.require = jest.fn(filepath => files[filepath]);
  }

  function buildCustomConfig(){
    return {
      sourceDirectory: './src',
      outputDirectory: './blog'
    };
  }

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    configService.flush();
  });

  it('should get default config if no config file has been found', () => {
    stubRequire();
    expect(configService.get()).toEqual({
      title: 'Triven',
      sourceDirectory: process.cwd(),
      outputDirectory: `${process.cwd()}/triven`
    });
  });

  it('should get default config if some error is thrown on config file read', () => {
    fileService.require = jest.fn(() => {
      throw 'File not found';
    });
    const config = configService.get();
    expect(console.log).toHaveBeenCalledWith('Config file not found. Using default config.');
    expect(config).toEqual({
      title: 'Triven',
      sourceDirectory: process.cwd(),
      outputDirectory: `${process.cwd()}/triven`
    });
  });

  it('should get custom config', () => {
    stubRequire(buildCustomConfig());
    expect(configService.get()).toEqual({
      sourceDirectory: `${process.cwd()}/src`,
      outputDirectory: `${process.cwd()}/blog`
    });
  });

  it('should fallback to default directories if custom config has no source and output directories set', () => {
    stubRequire('');
    expect(configService.get()).toEqual({
      sourceDirectory: process.cwd(),
      outputDirectory: `${process.cwd()}/triven`
    });
  });

  it('should read config file only once', () => {
    stubRequire();
    configService.get();
    configService.get();
    expect(fileService.require).toHaveBeenCalledTimes(1);
  });
});
