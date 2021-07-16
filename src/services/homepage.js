const path = require('path');
const listService = require('./list');
const { fileService } = require('./file');
const pageService = require('./page');

const _public = {};

_public.build = ([...postSummaries], outputDirectory) => {
  const pages = listService.divideByNumberOfItems(orderByDateDesc(postSummaries));
  pages.forEach((postPage, index) => {
    const pageNumber = index + 1;
    const page = pageService.build(postPage, { page: pageNumber, total: pages.length });
    fileService.write(buildFilepath(outputDirectory, pageNumber), page);
  });
};

function orderByDateDesc(postSummaries){
  return postSummaries.sort((a, b) => a.date > b.date ? -1 : 1);
}

function buildFilepath(outputDirectory, pageNumber){
  const filename = pageNumber === 1 ? 'index.html' : `./p/${pageNumber}/index.html`;
  return path.join(outputDirectory, filename);
}

module.exports = _public;
