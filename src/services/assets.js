const md5 = require('md5');
const path = require('path');
const domService = require('./dom');
const configService = require('./config');
const minifyService = require('./minify');
const { fileService } = require('./file');

const _public = {};

let cache = [];

_public.save = filepath => handle(filepath, () => saveAsset(filepath));

_public.copy = filepath => handle(filepath, () => copyAsset(filepath));

_public.handleRelativeImages = htmlString => {
  const $ = domService.parseHTMLString(htmlString);
  $('img').filter((index, el) => isRelativeImage($(el).attr('src'))).each((index, el) => {
    const filename = _public.copy(buildLocalImageFilepath($(el).attr('src')));
    $(el).attr('src', `${getAssetsDirectoryName()}/${filename}`);
  });
  return $.html();
};

_public.flushCache = () => {
  cache = [];
};

function handle(filepath, act){
  const cachedFilename = findFilenameByFilepath(filepath);
  if(cachedFilename) return cachedFilename;
  const filename = act();
  cache.push({ filepath, filename });
  return filename;
}

function findFilenameByFilepath(filepath){
  const cachedItem = cache.find(item => item.filepath === filepath);
  return cachedItem && cachedItem.filename;
}

function saveAsset(filepath){
  return store(filepath, ({ filename, file }) => {
    fileService.write(`${getAssetsDirectoryFilepath()}/${filename}`, file);
  });
}

function copyAsset(filepath){
  return store(filepath, ({ filename }) => {
    fileService.copySync(filepath, `${getAssetsDirectoryFilepath()}/${filename}`);
  });
}

function store(filepath, storeAsset){
  const { filename, file } = identifyFile(filepath);
  storeAsset({ filename, file });
  return filename;
}

function identifyFile(filepath){
  const { name, extension } = fileService.getFileInfoByFilepath(filepath);
  const file = minifyService.minifyByFilepath(filepath);
  const filename = `${name}-${md5(file)}.${extension}`;
  return { filename, file };
}

function getAssetsDirectoryFilepath(){
  const { outputDirectory } = configService.get();
  return `${outputDirectory}/${getAssetsDirectoryName()}`;
}

function getAssetsDirectoryName(){
  return 'assets';
}

function isRelativeImage(imgSrc){
  return !isAbsoluteSrcRegex.test(imgSrc);
}

function buildLocalImageFilepath(imgSrc){
  const { sourceDirectory } = configService.get();
  return path.join(sourceDirectory, imgSrc);
}

const isAbsoluteSrcRegex = new RegExp(/^https?:\/\/.+/);

module.exports = _public;
