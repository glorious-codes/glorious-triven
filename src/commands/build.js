const docService = require('../services/doc');
const buildService = require('../services/build');

const _public = {};

_public.exec = options => {
  const option = getOption(options);
  const { isHelpFlag, log } = docService;
  return isHelpFlag(option) ? log('build') : buildService.init();
};

function getOption(options){
  return options ? options[0] : null;
}

module.exports = _public;
