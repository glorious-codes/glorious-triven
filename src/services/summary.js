const path = require('path');
const assetsService = require('./assets');
const configService = require('./config');

const _public = {};

_public.build = (fileContent, filepath) => {
  const baseSummary = { title: 'Untitled', lang: configService.get().lang };
  const customSummary = buildCustomSummary(fileContent.split('\n'), filepath);
  return appendUrl({ ...baseSummary, ...customSummary }, filepath);
};

function buildCustomSummary(lines, articleFilepath){
  const customSummary = {};
  for (var i = 0; i < lines.length; i++) {
    if(lines[i].trim() === '---') break;
    handleCustomSummaryItem(lines[i], customSummary, articleFilepath);
  }
  return customSummary;
}

function handleCustomSummaryItem(line, customSummary, articleFilepath){
  const { key, value } = buildCustomSummaryItem(line, articleFilepath);
  if(key && value) customSummary[key] = value;
}

function buildCustomSummaryItem(line, articleFilepath){
  const dividerIndex = line.indexOf(':');
  const key = getCustomSummaryItemCrumb(line, 0, dividerIndex);
  const value = getCustomSummaryItemCrumb(line, dividerIndex+1);
  return value ? { key, value: parseValue(key, value, articleFilepath) } : { key };
}

function getCustomSummaryItemCrumb(line, startIndex, endIndex){
  const crumb = line.substring(startIndex, endIndex).trim();
  if(crumb) return crumb;
}

function appendUrl({ externalUrl, ...rest }, filepath){
  return { ...buildUrl(externalUrl, filepath), ...rest };
}

function buildUrl(externalUrl, filepath){
  if(externalUrl) return { url: externalUrl, external: true };
  return { url: path.basename(filepath).replace('.md', '.html') };
}

function parseValue(key, value, articleFilepath){
  if(key === 'image') return buildAbsoluteImageUrl(value, articleFilepath);
  return value === 'true' ? true : value;
}

function buildAbsoluteImageUrl(imageFilename, articleFilepath) {
  const imageFilepath = assetsService.handleRelativeAsset({
    baseDir: path.dirname(articleFilepath),
    filename: imageFilename
  });
  return [configService.get().url, imageFilepath].join('/').replace('/+', '/');
}

module.exports = _public;
