const summaryService = require('./summary');

describe('Summary Service', () => {
  function buildMarkdownFileMock({ title, date, description, keywords, externalUrl, summary, lang }){
    return `
title: ${title || ''}
date: ${date || ''}
description: ${description || ''}
keywords: ${keywords || ''}
externalUrl: ${externalUrl || ''}
summary: ${summary || ''}
lang: ${lang || ''}

---

Here is the first article paragraph.
`;
  }

  it('should generate a JSON containin title and lang by default', () => {
    expect(summaryService.build('')).toEqual({
      title: 'Untitled',
      lang: 'en-US'
    });
  });

  it('should optionally contain a custom title', () => {
    const title = 'New Year!';
    expect(summaryService.build(buildMarkdownFileMock({ title }))).toEqual({
      title,
      lang: 'en-US'
    });
  });

  it('should optionally contain a custom date', () => {
    const date = '2021-06-18';
    expect(summaryService.build(buildMarkdownFileMock({ date }))).toEqual({
      title: 'Untitled',
      date,
      lang: 'en-US'
    });
  });

  it('should optionally contain a custom description', () => {
    const description = 'This is a description';
    expect(summaryService.build(buildMarkdownFileMock({ description }))).toEqual({
      title: 'Untitled',
      description,
      lang: 'en-US'
    });
  });

  it('should optionally contain a custom keywords', () => {
    const keywords = 'some, key, words';
    expect(summaryService.build(buildMarkdownFileMock({ keywords }))).toEqual({
      title: 'Untitled',
      keywords,
      lang: 'en-US'
    });
  });

  it('should optionally contain a custom external url', () => {
    const externalUrl = 'https://rafaelcamargo.com';
    expect(summaryService.build(buildMarkdownFileMock({ externalUrl }))).toEqual({
      title: 'Untitled',
      externalUrl,
      lang: 'en-US'
    });
  });

  it('should optionally contain a custom summary', () => {
    const summary = 'This is a summary';
    expect(summaryService.build(buildMarkdownFileMock({ summary }))).toEqual({
      title: 'Untitled',
      summary,
      lang: 'en-US'
    });
  });

  it('should optionally contain a custom language', () => {
    const lang = 'pt-BR';
    expect(summaryService.build(buildMarkdownFileMock({ lang }))).toEqual({
      title: 'Untitled',
      lang
    });
  });
});
