const configService = require('./config');
const { fileService } = require('./file');

const _public = {};

_public.mockTrivenConfig = customConfig => {
  configService.flush();
  fileService.require = jest.fn(filepath => buildFilesMock(customConfig)[filepath]);
};

function buildFilesMock(customConfig){
  return {
    [`${process.cwd()}/triven.config`]: { ...customConfig }
  };
}

module.exports = _public;
