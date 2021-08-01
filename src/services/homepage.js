const path = require('path');
const listService = require('./list');
const { fileService } = require('./file');
const { buildHrefPrefixes } = require('./homepage-href');
const pageService = require('./page');

const _public = {};

_public.build = ([...postSummaries], outputDirectory) => {
  const languages = identifyPostLanguages(postSummaries);
  const postSummariesOrderedByDescDate = orderByDateDesc(postSummaries);
  buildHomepages(postSummariesOrderedByDescDate, outputDirectory);
  buildLanguageSpecificHomepages(postSummariesOrderedByDescDate, outputDirectory, languages);
};

function identifyPostLanguages(postSummaries){
  return listService.rejectRepeatedValues(postSummaries.map(summary => summary.lang));
}

function orderByDateDesc(postSummaries){
  return [...postSummaries].sort((a, b) => a.date > b.date ? -1 : 1);
}

function buildLanguageSpecificHomepages(postSummaries, outputDirectory, languages){
  if(languages.length > 1) {
    languages.forEach(lang => {
      buildHomepages(
        filterPostSummariesByLang(postSummaries, lang),
        `${outputDirectory}/l/${lang}`,
        lang
      );
    });
  }
}

function filterPostSummariesByLang(summaries, lang){
  return summaries.filter(summary => summary.lang === lang);
}

function buildHomepages(postSummaries, outputDirectory, customLang){
  const postSummaryPages = listService.divideByNumberOfItems(postSummaries);
  postSummaryPages.forEach((postSummaries, index) => {
    const pageNumber = index + 1;
    const html = pageService.build(postSummaries, {
      page: pageNumber,
      total: postSummaryPages.length,
      hrefPrefixes: buildHrefPrefixes({ pageNumber, customLang }),
      customLang
    });
    fileService.write(buildFilepath(outputDirectory, pageNumber), html);
  });
}

function buildFilepath(outputDirectory, pageNumber){
  const filename = pageNumber === 1 ? 'index.html' : `./p/${pageNumber}/index.html`;
  return path.join(outputDirectory, filename);
}

module.exports = _public;
