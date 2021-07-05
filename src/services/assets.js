const md5 = require('md5');
const configService = require('./config');
const minifyService = require('./minify');
const { fileService } = require('./file');

const _public = {};

let cache = [];

_public.save = filepath => {
  const cachedFilename = findFilenameByFilepath(filepath);
  if(cachedFilename) return cachedFilename;
  const filename = saveAsset(filepath);
  cache.push({ filepath, filename });
  return filename;
};

_public.flushCache = () => {
  cache = [];
};

function findFilenameByFilepath(filepath){
  const cachedItem = cache.find(item => item.filepath === filepath);
  return cachedItem && cachedItem.filename;
}

function saveAsset(filepath){
  const { name, extension } = fileService.getFileInfoByFilepath(filepath);
  const file = minifyService.minifyByFilepath(filepath);
  const filename = `${name}-${md5(file)}.${extension}`;
  fileService.write(`${getAssetsDirectory()}/${filename}`, file);
  return filename;
}

function getAssetsDirectory(){
  const { outputDirectory } = configService.get();
  return `${outputDirectory}/assets`;
}

module.exports = _public;
