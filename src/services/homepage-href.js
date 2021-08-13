const _public = {};
const TWO_DIRECTORIES_UP = '../../';
const FOUR_DIRECTORIES_UP = '../../../../';

_public.buildHrefPrefixes = ({ pageNumber, lang }) => {
  if(lang) return buildPrefixesForSpecificLangHomepage(pageNumber);
  return buildPrefixesForMultiLangHomepage(pageNumber);
};

function buildPrefixesForMultiLangHomepage(pageNumber){
  return isFirstPage(pageNumber) ? buildPrefixes('') : buildPrefixes(TWO_DIRECTORIES_UP);
}

function buildPrefixesForSpecificLangHomepage(pageNumber){
  return isFirstPage(pageNumber) ? buildPrefixes(TWO_DIRECTORIES_UP) : buildPrefixes(FOUR_DIRECTORIES_UP);
}

function isFirstPage(pageNumber){
  return pageNumber === 1;
}

function buildPrefixes(levelsUp){
  return { asset: levelsUp, post: levelsUp };
}

module.exports = _public;
