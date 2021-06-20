const path = require('path');
const { fileService } = require('./file');

const _public = {};

_public.log = doc => {
  const filepath = path.join(__dirname, `../docs/${doc}.txt`);
  console.log(fileService.readSync(filepath));
};

_public.isHelpFlag = flag => {
  return flag == '--help' || flag == '-h';
};

_public.isVersionFlag = flag => {
  return flag == '--version' || flag == '-v';
};

_public.logUnknownOption = (command, option) => {
  console.log(`Unknown option "${option}". Try "triven ${command} --help" to see available options.`);
};

module.exports = _public;
