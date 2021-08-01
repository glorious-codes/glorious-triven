const dateService = require('./date');
const domService = require('./dom');
const templateService = require('./template');

const _public = {};

_public.build = (posts, { page, total, hrefPrefixes = {}, customLang }) => {
  const body = buildPageBody(posts, page, total, hrefPrefixes.post);
  return domService.minifyHTML(buildPage(body, hrefPrefixes.asset, customLang));
};

function buildPageBody(posts, page, total, postHrefPrefix){
  return `
    <main class="tn-main">
      ${buildPostList(posts, page, postHrefPrefix)}
      ${buildFooter(page, total)}
    </main>
  `;
}

function buildPostList(posts, page, postHrefPrefix = ''){
  const items = posts.map(post => {
    const href = buildPostHref(post.url, postHrefPrefix);
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
  return page === 2 ? '../../' : `../${page - 1}`;
}

function buildNextPageLink(page, total){
  return page !== total ? `<a href="${buildNextPageLinkHref(page)}" class="tn-older-link">Older</a>` : '';
}

function buildNextPageLinkHref(page){
  const nextPageNumber = page + 1;
  return page === 1 ? `p/${nextPageNumber}` : `../${nextPageNumber}`;
}

function handleLinkAttrs({ external }){
  return external ? 'rel="noopener noreferrer" target="_blank"' : '';
}

function buildPostHref(href, postHrefPrefix){
  const prefix = !href.includes('http') ? postHrefPrefix : '';
  return `${prefix}${href.replace('.html', '')}`;
}

function buildPage(body, assetsDirPrefix, customLang){
  const template = templateService.getHomepageTemplate({ assetsDirPrefix, customLang });
  return templateService.replaceVar(template, 'triven:posts', body);
}

module.exports = _public;
