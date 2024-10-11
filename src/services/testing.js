const configService = require('./config');
const { fileService } = require('./file');

const _public = {};

_public.mockTrivenConfig = customConfig => {
  configService.flush();
  fileService.require = jest.fn(filepath => buildFilesMock(customConfig)[filepath]);
};

_public.getExpectedTrivenStylesheetHash = () => {
  return '6d4be2399e652dfdd2b6c554b0f123f1';
};

function buildFilesMock(customConfig){
  return {
    [`${process.cwd()}/triven.config`]: { ...customConfig }
  };
}

module.exports = _public;
