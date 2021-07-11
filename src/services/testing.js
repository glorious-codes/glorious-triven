const configService = require('./config');
const { fileService } = require('./file');

const _public = {};

_public.mockCustomTemplates = (config = {}) => {
  configService.flush();
  const filesMock = {
    [`${process.cwd()}/triven.config`]: {
      ...config,
      templates: {
        article: './src/templates/custom-article.html',
        homepage: './src/templates/custom-homepage.html',
        ...config.templates
      }
    }
  };
  fileService.require = jest.fn(filepath => filesMock[filepath]);
};

module.exports = _public;
