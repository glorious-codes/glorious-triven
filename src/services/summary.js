const path = require('path');
const configService = require('./config');

const _public = {};

_public.build = (fileContent, filepath) => {
  const baseSummary = { title: 'Untitled', lang: configService.get().lang };
  const customSummary = hasMetadata(fileContent) ? buildCustomSummary(fileContent.split('\n')) : {};
  return appendUrl({ ...baseSummary, ...customSummary }, filepath);
};

function hasMetadata(fileContent){
  const containsMetadataDivider = new RegExp(/^---\n$/m);
  return containsMetadataDivider.test(fileContent);
}

function buildCustomSummary(lines){
  const customSummary = {};
  for (var i = 0; i < lines.length; i++) {
    if(lines[i].trim() === '---') break;
    handleCustomSummaryItem(lines[i], customSummary);
  }
  return customSummary;
}

function handleCustomSummaryItem(line, customSummary){
  const { key, value } = buildCustomSummaryItem(line);
  if(key && value) customSummary[key] = value;
}

function buildCustomSummaryItem(line){
  const dividerIndex = line.indexOf(':');
  const key = getCustomSummaryItemCrumb(line, 0, dividerIndex);
  const value = getCustomSummaryItemCrumb(line, dividerIndex+1);
  return value ? { key, value } : { key };
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

module.exports = _public;
