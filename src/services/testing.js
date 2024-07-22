const configService = require('./config');
const { fileService } = require('./file');

const _public = {};

_public.mockTrivenConfig = customConfig => {
  configService.flush();
  fileService.require = jest.fn(filepath => buildFilesMock(customConfig)[filepath]);
};

_public.getExpectedTrivenStylesheetHash = () => {
  return '806e3ebccb3737bcb574e481b48f2400';
};

function buildFilesMock(customConfig){
  return {
    [`${process.cwd()}/triven.config`]: { ...customConfig }
  };
}

module.exports = _public;
