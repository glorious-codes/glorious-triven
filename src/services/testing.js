const configService = require('./config');
const { fileService } = require('./file');

const _public = {};

_public.mockTrivenConfig = customConfig => {
  configService.flush();
  fileService.require = jest.fn(filepath => buildFilesMock(customConfig)[filepath]);
};

_public.getExpectedTrivenStylesheetHash = () => {
  return '56c63fac93c7c7d4116654da60632c74';
};

function buildFilesMock(customConfig){
  return {
    [`${process.cwd()}/triven.config`]: { ...customConfig }
  };
}

module.exports = _public;
