const _public = {};

_public.build = fileContent => {
  const baseSummary = { title: 'Untitled', lang: 'en-US' };
  return { ...baseSummary, ...buildCustomSummary(fileContent.split('\n')) };
};

function buildCustomSummary(lines){
  const customSummary = {};
  for (var i = 0; i < lines.length; i++) {
    if(lines[i].trim() === '---') break;
    const { key, value } = buildCustomSummaryItem(lines[i]);
    if(key && value) customSummary[key] = value;
  }
  return customSummary;
}

function buildCustomSummaryItem(line){
  const dividerIndex = line.indexOf(':');
  const item = {}
  const key = getCustomSummaryItemCrumb(line, 0, dividerIndex);
  const value = getCustomSummaryItemCrumb(line, dividerIndex+1);
  return value ? { key, value } : { key };
}

function getCustomSummaryItemCrumb(line, startIndex, endIndex){
  const crumb = line.substring(startIndex, endIndex).trim();
  if(crumb) return crumb;
}

module.exports = _public;
