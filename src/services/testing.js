const configService = require('./config');
const { fileService } = require('./file');

const _public = {};

_public.mockTrivenConfig = customConfig => {
  configService.flush();
  fileService.require = jest.fn(filepath => buildFilesMock(customConfig)[filepath]);
};

_public.getExpectedTrivenStylesheetHash = () => {
  return '99d5180fd53f2cbfd9106f622d4e7738';
};

function buildFilesMock(customConfig){
  return {
    [`${process.cwd()}/triven.config`]: { ...customConfig }
  };
}

module.exports = _public;
