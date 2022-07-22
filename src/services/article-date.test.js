const { mockTrivenConfig } = require('./testing');
const configService = require('./config');
const articleDateService = require('./article-date');

describe('Article Date Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    configService.flush();
  });

  it('should not build article date markup if no params have been given', () => {
    expect(articleDateService.buildMarkup()).toEqual('');
  });

  it('should build article date markup', () => {
    expect(articleDateService.buildMarkup('2022-03-27')).toEqual([
      '<time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2022-03-27">',
      '27/03/2022',
      '</time>'
    ].join(''));
  });

  it('should optionally format a date containing month, day, and year separated by slash for american english language', () => {
    expect(articleDateService.buildMarkup('2022-03-27', 'en-US')).toEqual([
      '<time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2022-03-27">',
      '3/27/2022',
      '</time>'
    ].join(''));
  });

  it('should optionally format a date according formatter passed on triven config file', () => {
    const isoDateString =  '2022-03-27';
    const lang = 'en-US';
    mockTrivenConfig({
      formatters: {
        date: (isoDateString, lang) => `${isoDateString} ${lang}`
      }
    });
    expect(articleDateService.buildMarkup(isoDateString, lang)).toEqual([
      '<time class="tn-date" itemprop="dateCreated pubdate datePublished" datetime="2022-03-27">',
      '2022-03-27 en-US',
      '</time>'
    ].join(''));
  });
});
