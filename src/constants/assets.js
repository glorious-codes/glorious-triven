module.exports = {
  ASSETS_DIRECTORY_NAME: 'a',
  ELEMENTS_TO_PARSE: [
    { selector: 'img', attr: 'src' },
    { selector: 'link[rel="stylesheet"]', attr: 'href' },
    { selector: 'link[rel="icon"]', attr: 'href' },
    { selector: 'link[rel="apple-touch-icon"]', attr: 'href' },
    { selector: 'meta[property="og:image"]', attr: 'content' },
    { selector: 'script', attr: 'src' },
    { selector: 'video', attr: 'src' },
    { selector: 'source', attr: 'src' }
  ]
};
