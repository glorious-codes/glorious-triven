const path = require('path');
const assetsService = require('./assets');
const articleDateService = require('./article-date');
const domService = require('./dom');
const excerptService = require('./excerpt');
const markdownService = require('./markdown');
const templateService = require('./template');
const translationService = require('./translation');

const _public = {};

_public.build = ({ filepath, summary, markdownText }, languages = []) => {
  const article = assetsService.handleRelativeAssets(
    markdownService.convert(markdownText),
    { baseDir: path.dirname(filepath), assetsDirPrefix: '../' }
  );
  return {
    summary: { ...summary, excerpt: excerptService.extract(article, summary) },
    article: fillTemplate(
      templateService.getArticleTemplate({ lang: summary.lang }),
      article,
      summary,
      languages,
    ),
    filepath
  };
};

function fillTemplate(template, article, summary, languages){
  const $ = parseHTMLString(templateService.replaceVar(template, 'triven:article', wrapArticle(summary, article, languages)));
  $('html').attr('lang', summary.lang);
  $('head').append(`<title>${summary.title}</title>`).append(buildMetaTags(summary));
  return $.html();
}

function wrapArticle({ title, date, lang }, article, languages){
  return `
    <main class="tn-main">
      <article class="tn-article">
        <header class="tn-header">
          <h1 class="tn-post-title">${title}</h1>
          <p class="tn-date">${articleDateService.format(date, lang)}</p>
        </header>
        ${article}
        <footer class="tn-footer">
          ${buildSeeAllPostsLink(languages, lang)}
        </footer>
      </article>
    </main>
  `;
}

function buildSeeAllPostsLink(languages, lang){
  const { seeAllPosts } = translationService.get(lang);
  const href = languages.length > 1 ? `../l/${lang}` : '../';
  return `<a href=${href}>${seeAllPosts}</a>`;
}

function buildMetaTags({ unlisted, ...rest }){
  const baseMetaTags = buildBaseMetaTags(rest);
  return unlisted ? `${baseMetaTags} ${buildRobotsMetaTags()}` : baseMetaTags;
}

function buildBaseMetaTags({ title, description = '', keywords = '' }){
  return `
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="twitter:card" content="summary">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">`;
}

function buildRobotsMetaTags(){
  return `
    <meta name="robots" content="noindex, nofollow">
  `;
}

function parseHTMLString(htmlString){
  return domService.parseHTMLString(htmlString);
}

module.exports = _public;
