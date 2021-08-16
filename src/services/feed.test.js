const configService = require('./config');
const dateService = require('./date');
const { fileService } = require('./file');
const { mockTrivenConfig } = require('./testing');
const postsMock = require('../mocks/posts');
const feedService = require('./feed');

describe('Feed Service', () => {
  function mockBaseConfig(){
    const title = 'My Blog';
    const url = 'https://myblog.com';
    const outputDirectory = 'some/dir';
    return { outputDirectory, url, title };
  }

  function getNowISOString(){
    const date = new Date();
    return dateService.removeSecondsFractionFromISOString(date.toISOString());
  }

  function formatFeedDate(dateString){
    const [year, month, day] = dateString.split('-').map(part => parseInt(part));
    const date = new Date(year, month - 1, day);
    return dateService.removeSecondsFractionFromISOString(date.toISOString());
  }

  beforeEach(() => {
    fileService.write = jest.fn();
  });

  it('should not build an atom file if no url has been set on triven config file', () => {
    mockTrivenConfig({});
    feedService.build(postsMock);
    expect(fileService.write).not.toHaveBeenCalled();
  });

  it('should build an atom file', () => {
    const config = mockBaseConfig();
    mockTrivenConfig(config);
    feedService.build(postsMock);
    expect(fileService.write).toHaveBeenCalledWith(
      `${configService.get().outputDirectory}/feed.atom`,`<?xml version="1.0" encoding="UTF-8"?>
<feed xml:lang="en-US" xmlns="http://www.w3.org/2005/Atom">
  <id>${config.url}/</id>
  <title>${config.title}</title>
  <link rel="alternate" type="text/html" href="${config.url}/"/>
  <link rel="self" type="application/atom+xml" href="${config.url}/feed.atom"/>
  <updated>${getNowISOString()}</updated>
  <author>
    <name>${config.title}</name>
  </author>
  <entry>
    <id>${config.url}/new-year</id>
    <title>New year!</title>
    <link rel="alternate" type="text/html" href="${config.url}/new-year"/>
    <published>${formatFeedDate(postsMock[0].date)}</published>
    <updated>${formatFeedDate(postsMock[0].date)}</updated>
    <summary>
      This is an excerpt for the first post
    </summary>
  </entry>
  <entry>
    <id>https://rafaelcamargo.com/the-pearl-and-the-mussels</id>
    <title>The pearl and the mussels</title>
    <link rel="alternate" type="text/html" href="https://rafaelcamargo.com/the-pearl-and-the-mussels"/>
    <published>${formatFeedDate(postsMock[1].date)}</published>
    <updated>${formatFeedDate(postsMock[1].date)}</updated>
    <summary>
      This is an excerpt for the second post
    </summary>
  </entry>
  <entry>
    <id>https://rafaelcamargo.com/incondicional-inhotim</id>
    <title>Incondicional Inhotim</title>
    <link rel="alternate" type="text/html" href="https://rafaelcamargo.com/incondicional-inhotim"/>
    <published>${formatFeedDate(postsMock[2].date)}</published>
    <updated>${formatFeedDate(postsMock[2].date)}</updated>
    <summary>
      Esse é um excerto para o terceiro artigo.
    </summary>
  </entry>
</feed>`
    );
  });

  it('should optionally build an atom file specifying a language', () => {
    const lang ='pt-BR';
    const postSummaryMock = {
      title: 'Pérolas e mariscos',
      date: '2020-05-31',
      url: 'perolas-e-mariscos.html',
      lang: 'pt-BR',
      excerpt: 'Excerto.'
    };
    const config = mockBaseConfig();
    mockTrivenConfig(config);
    feedService.build([postSummaryMock], lang);
    expect(fileService.write).toHaveBeenCalledWith(
      `${configService.get().outputDirectory}/l/${lang}/feed.atom`,`<?xml version="1.0" encoding="UTF-8"?>
<feed xml:lang="${lang}" xmlns="http://www.w3.org/2005/Atom">
  <id>${config.url}/l/${lang}/</id>
  <title>${config.title}</title>
  <link rel="alternate" type="text/html" href="${config.url}/l/${lang}/"/>
  <link rel="self" type="application/atom+xml" href="${config.url}/l/${lang}/feed.atom"/>
  <updated>${getNowISOString()}</updated>
  <author>
    <name>${config.title}</name>
  </author>
  <entry>
    <id>${config.url}/perolas-e-mariscos</id>
    <title>Pérolas e mariscos</title>
    <link rel="alternate" type="text/html" href="${config.url}/perolas-e-mariscos"/>
    <published>${formatFeedDate(postSummaryMock.date)}</published>
    <updated>${formatFeedDate(postSummaryMock.date)}</updated>
    <summary>
      Excerto.
    </summary>
  </entry>
</feed>`
    );
  });
});
