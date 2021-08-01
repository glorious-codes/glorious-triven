const summaryService = require('./summary');

describe('Summary Service', () => {
  function buildMarkdownFileMock({
    title = '',
    date = '',
    description = '',
    keywords = '',
    externalUrl = '',
    excerpt = '',
    lang = ''
  }){
    return `
title: ${title}
date: ${date}
description: ${description}
keywords: ${keywords}
externalUrl: ${externalUrl}
excerpt: ${excerpt}
lang: ${lang}

---

Here is the first article paragraph.
`;
  }

  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should generate a JSON containing title, lang and url by default', () => {
    expect(summaryService.build('', 'blank.md')).toEqual({
      title: 'Untitled',
      lang: 'en-US',
      url: 'blank.html'
    });
  });

  it('should optionally contain a custom title', () => {
    const title = 'New Year!';
    expect(summaryService.build(buildMarkdownFileMock({ title }), 'new-year.md')).toEqual({
      lang: 'en-US',
      url: 'new-year.html',
      title
    });
  });

  it('should optionally contain a custom date', () => {
    const date = '2021-06-18';
    expect(summaryService.build(buildMarkdownFileMock({ date }), 'untitled.md')).toEqual({
      title: 'Untitled',
      lang: 'en-US',
      url: 'untitled.html',
      date
    });
  });

  it('should optionally contain a custom description', () => {
    const description = 'This is a description';
    expect(summaryService.build(buildMarkdownFileMock({ description }), 'untitled.md')).toEqual({
      title: 'Untitled',
      lang: 'en-US',
      url: 'untitled.html',
      description
    });
  });

  it('should optionally contain a custom keywords', () => {
    const keywords = 'some, key, words';
    expect(summaryService.build(buildMarkdownFileMock({ keywords }), 'untitled.md')).toEqual({
      title: 'Untitled',
      lang: 'en-US',
      url: 'untitled.html',
      keywords
    });
  });

  it('should optionally contain a custom external url', () => {
    const externalUrl = 'https://rafaelcamargo.com';
    expect(summaryService.build(buildMarkdownFileMock({ externalUrl }), 'untitled.md')).toEqual({
      title: 'Untitled',
      lang: 'en-US',
      url: externalUrl,
      external: true
    });
  });

  it('should optionally contain a custom excerpt', () => {
    const excerpt = 'This is an excerpt';
    expect(summaryService.build(buildMarkdownFileMock({ excerpt }), 'untitled.md')).toEqual({
      title: 'Untitled',
      lang: 'en-US',
      url: 'untitled.html',
      excerpt
    });
  });

  it('should optionally contain a custom language', () => {
    const lang = 'pt-BR';
    expect(summaryService.build(buildMarkdownFileMock({ lang }), 'untitled.md')).toEqual({
      title: 'Untitled',
      url: 'untitled.html',
      lang
    });
  });

  it('should return a default summary if no metadata has been found on markdown file', () => {
    const markdown = '![Valeska Soares Gallery](http://valeskasoares.net/wp-content/uploads/2009/10/DSC8218.jpg)';
    expect(summaryService.build(markdown, 'untitled.md')).toEqual({
      title: 'Untitled',
      url: 'untitled.html',
      lang: 'en-US'
    });
  });
});
