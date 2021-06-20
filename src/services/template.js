const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.getByFilename = filename => {
  return fileService.readSync(path.join(__dirname, `../templates/${filename}`));
};

module.exports = _public;
