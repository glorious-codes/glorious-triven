const marked = require('marked');
const dateService = require('./date');
const domService = require('./dom');
const excerptService = require('./excerpt');
const { fileService } = require('./file');
const stylesService = require('./styles');
const summaryService = require('./summary');
const templateService = require('./template');

const _public = {};

_public.build = filepath => {
  const markdownText = fileService.readSync(filepath);
  const article = marked(removeMetadataLines(markdownText), { headerIds: false });
  const summary = summaryService.build(markdownText, filepath);
  return {
    summary: { ...summary, excerpt: excerptService.extract(article, summary) },
    article: fillTemplate(
      templateService.getArticleTemplate(summary),
      article,
      summary,
    )
  };
};

function removeMetadataLines(markdownLines){
  return markdownLines.split('---')[1];
}

function fillTemplate(template, article, summary){
  const $ = parseHTMLString(template.replace('{{article}}', wrapArticle(summary, article)));
  $('html').attr('lang', summary.lang);
  $('head').append(`<title>${summary.title}</title>`).append(buildMetaTags(summary));
  return stylesService.appendBaseStylesheet($.html());
}

function wrapArticle({ title, date, lang }, article){
  return `
    <main class="tn-main">
      <article class="tn-article">
        <header class="tn-header">
          <h1 class="tn-post-title">${title}</h1>
          <p class="tn-date">${dateService.format(date, lang)}</p>
        </header>
        ${article}
        <footer class="tn-footer">
          <a href=".">See all posts</a>
        </footer>
      </article>
    </main>
  `;
}

function buildMetaTags({ description = '', keywords = '' }){
  return `
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
  `;
}

function parseHTMLString(htmlString){
  return domService.parseHTMLString(htmlString);
}

module.exports = _public;
