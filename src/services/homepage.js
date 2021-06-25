const path = require('path');
const listService = require('./list');
const { fileService } = require('./file');
const pageService = require('./page');

const _public = {};

_public.build = ([...postSummaries], outputDirectory) => {
  const pages = listService.divideByNumberOfItems(orderByDateDesc(postSummaries));
  pages.forEach((postPage, index) => {
    const pageNumber = index + 1;
    const filepath = buildFinalOutputDirectory(outputDirectory, pageNumber);
    const page = pageService.build(postPage, { page: pageNumber, total: pages.length });
    fileService.write(filepath, page);
  });
};

function orderByDateDesc(postSummaries){
  return postSummaries.sort((a, b) => a.date > b.date ? -1 : 1);
}

function buildFinalOutputDirectory(outputDirectory, pageNumber){
  const filename = buildPageFilename(pageNumber);
  const finalDestination = pageNumber > 1 ? `./p/${filename}` : `./${filename}`;
  return path.join(outputDirectory, finalDestination);
}

function buildPageFilename(pageNumber){
  return pageNumber === 1 ? 'index.html' : `${pageNumber}.html`;
}

module.exports = _public;
