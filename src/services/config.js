const path = require('path');
const { fileService } = require('./file');

const _public = {};
let config;

_public.get = () => {
  if(config) return config;
  config = requireConfigFile();
  return config;
};

_public.flush = () => {
  config = null;
};

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
  const rootDirectory = process.cwd();
  const customSourceDirectory = getCustomConfigPath(customConfig, 'sourceDirectory');
  const customOutputDirectory = getCustomConfigPath(customConfig, 'outputDirectory') || './triven';
  return {
    ...customConfig,
    sourceDirectory: path.join(rootDirectory, customSourceDirectory),
    outputDirectory: path.join(rootDirectory, customOutputDirectory)
  };
}

function getCustomConfigPath(customConfig, attribute){
  return customConfig[attribute] || '';
}

function buildDefaultConfig(){
  const rootDirectory = process.cwd();
  return {
    sourceDirectory: rootDirectory,
    outputDirectory: `${rootDirectory}/triven`
  };
}

module.exports = _public;
