const dateService = require('./date');
const domService = require('./dom');
const stylesService = require('./styles');
const templateService = require('./template');

const _public = {};

_public.build = (posts, { page, total }) => {
  const body = buildPageBody(buildPostList(posts, page), page, total);
  return domService.minifyHTML(buildPage(body, page));
};

function buildPostList(posts, page){
  const items = posts.map(post => {
    const href = buildPostHref(post.url, page);
    return `
      <li>
        <section>
          <header>
            <a href="${href}" ${handleLinkAttrs(post)}>
              <h2>${post.title}</h2>
            </a>
            <p>${dateService.format(post.date, post.lang)}</p>
          </header>
          <p>${post.excerpt}</p>
          <a href="${href}" ${handleLinkAttrs(post)}>
            Read more
          </a>
        </section>
      </li>
    `;
  }).join('');
  return `<ul>${items}</ul>`;
}

function buildPageBody(postList, page, total){
  return `<main>${postList}</main>${buildFooter(page, total)}`;
}

function buildFooter(page, total){
  const prevLink = buildPreviousPageLink(page);
  const nextLink = buildNextPageLink(page, total);
  return prevLink || nextLink ? `<footer><nav>${prevLink}${nextLink}</nav></footer>` : '';
}

function buildPreviousPageLink(page){
  return page > 1 ? `<a href="${buildPreviousPageLinkHref(page)}">Previous</a>` : '';
}

function buildPreviousPageLinkHref(page){
  return page === 2 ? '../' : `${page - 1}`;
}

function buildNextPageLink(page, total){
  return page !== total ? `<a href="${buildNextPageLinkHref(page)}">Next</a>` : '';
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
  const template = templateService.getHomepageTemplate();
  const hrefPrefix = getAssetsHrefPrefix(pageNumber);
  return stylesService.appendBaseStylesheet(template.replace('{{posts}}', body), {
    hrefPrefix
  });
}

function getAssetsHrefPrefix(pageNumber){
  return pageNumber > 1 ? '../' : '';
}

module.exports = _public;
