const path = require('path');
const pkg = require('../../package.json');
const { fileService } = require('../services/file');

const _public = {};

_public.exec = () => {
  const doc = fileService.readSync(path.join(__dirname, '../docs/triven.txt'));
  console.log(doc.replace('{ description }', pkg.description));
};

module.exports = _public;
