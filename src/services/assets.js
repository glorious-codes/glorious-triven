const md5 = require('md5');
const path = require('path');
const domService = require('./dom');
const configService = require('./config');
const minifyService = require('./minify');
const { fileService } = require('./file');

const _public = {}, ASSETS_DIRNAME = 'assets';

let cache = [];

_public.save = filepath => handle(filepath, () => saveAsset(filepath));

_public.copy = filepath => handle(filepath, () => copyAsset(filepath));

_public.handleRelativeAssets = (htmlString, { baseDir, assetsDirPrefix = '' }) => {
  const markupData =  getAssetsMarkupData();
  const $ = domService.parseHTMLString(htmlString);
  markupData.forEach(({ selector, attr }) => {
    $(selector).filter((index, el) => isRelativeAsset($(el).attr(attr))).each((index, el) => {
      const filename = _public.copy(buildLocalAssetFilepath(baseDir, $(el).attr(attr)));
      $(el).attr(attr, assetsDirPrefix + `${ASSETS_DIRNAME}/${filename}`);
    });
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
  return store(filepath, ({ filename, file, extension }) => {
    if(['css','js'].includes(extension)) return fileService.write(`${getAssetsDirectoryFilepath()}/${filename}`, file);
    return fileService.copySync(filepath, `${getAssetsDirectoryFilepath()}/${filename}`);
  });
}

function store(filepath, storeAsset){
  const { filename, file, extension } = identifyFile(filepath);
  storeAsset({ filename, file, extension });
  return filename;
}

function identifyFile(filepath){
  const { name, extension } = fileService.getFileInfoByFilepath(filepath);
  const file = minifyService.minifyByFilepath(filepath);
  const filename = `${name}-${md5(file)}.${extension}`;
  return { filename, file, extension };
}

function getAssetsMarkupData(){
  return [
    { selector: 'img', attr: 'src' },
    { selector: 'link[rel="stylesheet"]', attr: 'href' },
    { selector: 'link[rel="icon"]', attr: 'href' },
    { selector: 'link[rel="apple-touch-icon"]', attr: 'href' },
    { selector: 'meta[property="og:image"]', attr: 'content' },
    { selector: 'script', attr: 'src' }
  ];
}

function getAssetsDirectoryFilepath(){
  const { outputDirectory } = configService.get();
  return `${outputDirectory}/${ASSETS_DIRNAME}`;
}

function isRelativeAsset(assetFilepath){
  return assetFilepath && !isAbsoluteSrcRegex.test(assetFilepath) && !isRootSrcRegex.test(assetFilepath);
}

function buildLocalAssetFilepath(baseDir, assetFilepath){
  return path.join(baseDir, assetFilepath);
}

const isAbsoluteSrcRegex = new RegExp(/^https?:\/\/.+/);

const isRootSrcRegex = new RegExp(/^\/.+/);

module.exports = _public;
