const path = require('path');
const { fileService } = require('./file');

const _public = {};
let config;

_public.get = () => getConfig();

_public.getCustomTemplateFilepath = type => {
  const { templates } = getConfig();
  return templates && templates[type] && buildAbsoluteFilepath(templates[type]);
};

_public.flush = () => {
  config = null;
};

function getConfig(){
  if(config) return config;
  config = requireConfigFile();
  return config;
}

function requireConfigFile(){
  let config;
  try {
    config = parseCustomConfigPaths(fileService.require(`${process.cwd()}/triven.config`));
  } catch(e) {
    console.log('Config file not found. Using default config.');
  }
  return config ? config : buildDefaultConfig();
}

function parseCustomConfigPaths(customConfig){
  const customSourceDirectory = getCustomConfigPath(customConfig, 'sourceDirectory');
  const customOutputDirectory = getCustomConfigPath(customConfig, 'outputDirectory') || './triven';
  return {
    ...customConfig,
    sourceDirectory: buildAbsoluteFilepath(customSourceDirectory),
    outputDirectory: buildAbsoluteFilepath(customOutputDirectory)
  };
}

function getCustomConfigPath(customConfig, attribute){
  return customConfig[attribute] || '';
}

function buildDefaultConfig(){
  const rootDirectory = getRootDirectory();
  return {
    title: 'Triven',
    sourceDirectory: rootDirectory,
    outputDirectory: `${rootDirectory}/triven`
  };
}

function buildAbsoluteFilepath(relativeFilepath){
  return path.join(getRootDirectory(), relativeFilepath);
}

function getRootDirectory(){
  return process.cwd();
}

module.exports = _public;
