const { fileService } = require('./file');
const metadataService = require('./metadata');
const summaryService = require('./summary');

const _public = {};

_public.buildData = filepaths => {
  return filepaths.map(filepath => {
    const fileContent = fileService.readSync(filepath);
    const summary = summaryService.build(fileContent, filepath);
    return { summary, markdownText: removeMetadataLines(fileContent), filepath };
  });
};

function removeMetadataLines(fileContent){
  if(!metadataService.hasMetadata(fileContent)) return fileContent;
  return fileContent.slice(fileContent.indexOf('---')+3).trim();
}

module.exports = _public;
