const dateService = require('./date');
const domService = require('./dom');
const stylesService = require('./styles');
const templateService = require('./template');

const _public = {};

_public.build = (posts, { page, total }) => {
  const body = buildPageBody(posts, page, total);
  return domService.minifyHTML(buildPage(body, page));
};

function buildPageBody(posts, page, total){
  return `
    <main class="tn-main">
      ${buildPostList(posts, page)}
      ${buildFooter(page, total)}
    </main>
  `;
}

function buildPostList(posts, page){
  const items = posts.map(post => {
    const href = buildPostHref(post.url, page);
    return `
      <li>
        <section>
          <header class="tn-header">
            <h2 class="tn-post-title">
              <a href="${href}" ${handleLinkAttrs(post)}>${post.title}</a>
            </h2>
            <p class="tn-date">${dateService.format(post.date, post.lang)}</p>
          </header>
          <p>${post.excerpt}</p>
          <footer class="tn-footer">
            <a href="${href}" ${handleLinkAttrs(post)} class="tn-read-more-link">
              Read more
            </a>
          </footer>
        </section>
      </li>
    `;
  }).join('');
  return `<ul class="tn-post-list">${items}</ul>`;
}

function buildFooter(page, total){
  const prevLink = buildPreviousPageLink(page);
  const nextLink = buildNextPageLink(page, total);
  return prevLink || nextLink ? `<footer class="tn-footer"><nav>${prevLink}${nextLink}</nav></footer>` : '';
}

function buildPreviousPageLink(page){
  return page > 1 ? `<a href="${buildPreviousPageLinkHref(page)}" class="tn-newer-link">Newer</a>` : '';
}

function buildPreviousPageLinkHref(page){
  return page === 2 ? '../' : `${page - 1}`;
}

function buildNextPageLink(page, total){
  return page !== total ? `<a href="${buildNextPageLinkHref(page)}" class="tn-older-link">Older</a>` : '';
}

function buildNextPageLinkHref(page){
  const nextPageNumber = page + 1;
  return page === 1 ? `p/${nextPageNumber}` : `${nextPageNumber}`;
}

function handleLinkAttrs({ external }){
  return external ? 'rel="noopener noreferrer" target="_blank"' : '';
}

function buildPostHref(href, page){
  const prefix = page > 1 && !href.includes('http') ? '../' : '';
  return `${prefix}${href.replace('.html', '')}`;
}

function buildPage(body, pageNumber){
  const template = templateService.getHomepageTemplate({ pageNumber });
  const hrefPrefix = getAssetsHrefPrefix(pageNumber);
  return stylesService.appendBaseStylesheet(templateService.replaceVar(template, 'triven:posts', body), {
    hrefPrefix
  });
}

function getAssetsHrefPrefix(pageNumber){
  return pageNumber > 1 ? '../' : '';
}

module.exports = _public;
