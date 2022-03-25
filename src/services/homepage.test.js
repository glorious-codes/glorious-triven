const postsMock = require('../mocks/posts');
const feedService = require('./feed');
const { fileService } = require('./file');
const pageService = require('./page');
const homepageService = require('./homepage');

describe('Homepage Service', () => {
  function stubPageBuild(){
    const html = '<p>some content</p>';
    pageService.build = jest.fn(() => html);
    return { html };
  }

  function buildFakeOutputDirectoryFilepath(){
    return 'some/output/dir';
  }

  beforeEach(() => {
    fileService.write = jest.fn();
    fileService.copySync = jest.fn();
    pageService.build = jest.fn();
    feedService.build = jest.fn();
  });

  it('should build home pages ordered by descending post date', () => {
    const [first, second, third] = postsMock;
    const orderedPosts = [second, third, first];
    homepageService.build(postsMock, '');
    expect(pageService.build).toHaveBeenCalledWith(orderedPosts, expect.any(Object));
  });

  it('should posts set as unlisted not be included in home pages or feeds', () => {
    const [first, second, third] = postsMock;
    const four = {
      title: 'Unlisted',
      date: '2022-03-25',
      url: 'unlisted.html',
      lang: 'en-US',
      excerpt: 'This is an unlisted post',
      unlisted: true
    };
    homepageService.build([first, four, second, third], '');
    expect(pageService.build).toHaveBeenCalledWith([second, third, first], expect.any(Object));
    expect(feedService.build).toHaveBeenCalledWith([second, first], 'en-US');
    expect(feedService.build).toHaveBeenCalledWith([third], 'pt-BR');
  });

  it('should save home page files according to their page numbers', () => {
    const outputDirectory = buildFakeOutputDirectoryFilepath();
    const postsMock = new Array(25);
    const { html } = stubPageBuild();
    homepageService.build(postsMock.fill({ some: 'postSummary', lang: 'en-US' }), outputDirectory);
    expect(pageService.build).toHaveBeenCalledWith(expect.any(Array), { page: 1, total: 3, hrefPrefixes: { asset: '', post: '' }, lang: undefined, availableLanguages: ['en-US'] });
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/index.html`, html);
    expect(pageService.build).toHaveBeenCalledWith(expect.any(Array), { page: 2, total: 3, hrefPrefixes: { asset: '../../', post: '../../' }, lang: undefined, availableLanguages: ['en-US'] });
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/p/2/index.html`, html);
    expect(pageService.build).toHaveBeenCalledWith(expect.any(Array), { page: 3, total: 3, hrefPrefixes: { asset: '../../', post: '../../' }, lang: undefined, availableLanguages: ['en-US'] });
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/p/3/index.html`, html);
  });

  it('should write a home page file for each language', () => {
    const outputDirectory = buildFakeOutputDirectoryFilepath();
    const { html } = stubPageBuild();
    homepageService.build(postsMock, outputDirectory);
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/l/en-US/index.html`, html);
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/l/pt-BR/index.html`, html);
  });

  it('should save language-specific home page files according to their page numbers', () => {
    const outputDirectory = buildFakeOutputDirectoryFilepath();
    const englishPostsMock = new Array(12);
    const portuguesePostsMock = new Array(12);
    const allPostsMock = [...englishPostsMock.fill({ lang: 'en-US' }), ...portuguesePostsMock.fill({ lang: 'pt-BR' })];
    const { html } = stubPageBuild();
    homepageService.build(allPostsMock, outputDirectory);
    expect(pageService.build).toHaveBeenCalledWith(expect.any(Array), { page: 1, total: 2, hrefPrefixes: { asset: '../../', post: '../../' }, lang: 'en-US', availableLanguages: ['en-US', 'pt-BR'] });
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/l/en-US/index.html`, html);
    expect(pageService.build).toHaveBeenCalledWith(expect.any(Array), { page: 2, total: 2, hrefPrefixes: { asset: '../../../../', post: '../../../../' }, lang: 'en-US', availableLanguages: ['en-US', 'pt-BR'] });
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/l/en-US/p/2/index.html`, html);
    expect(pageService.build).toHaveBeenCalledWith(expect.any(Array), { page: 1, total: 2, hrefPrefixes: { asset: '../../', post: '../../' }, lang: 'pt-BR', availableLanguages: ['en-US', 'pt-BR'] });
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/l/pt-BR/index.html`, html);
    expect(pageService.build).toHaveBeenCalledWith(expect.any(Array), { page: 2, total: 2, hrefPrefixes: { asset: '../../../../', post: '../../../../' }, lang: 'pt-BR', availableLanguages: ['en-US', 'pt-BR'] });
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/l/pt-BR/p/2/index.html`, html);
  });

  it('should not save language-specific home page files if all posts are written in the same language', () => {
    stubPageBuild();
    const outputDirectory = buildFakeOutputDirectoryFilepath();
    const [first, second] = postsMock;
    homepageService.build([first, second], outputDirectory);
    expect(fileService.write).not.toHaveBeenCalledWith(`${outputDirectory}/l/en-US/index.html`, expect.any(String));
  });

  it('should write an atom feed file', () => {
    stubPageBuild();
    const [first] = postsMock;
    homepageService.build([first], '');
    expect(feedService.build).toHaveBeenCalledWith([first], undefined);
    expect(feedService.build).toHaveBeenCalledTimes(1);
  });

  it('should write language-specific atom feed files if posts have been written in more than one language', () => {
    stubPageBuild();
    const [first, second, third] = postsMock;
    homepageService.build(postsMock, '');
    expect(feedService.build).toHaveBeenCalledWith([second, third, first], undefined);
    expect(feedService.build).toHaveBeenCalledWith([second, first], 'en-US');
    expect(feedService.build).toHaveBeenCalledWith([third], 'pt-BR');
    expect(feedService.build).toHaveBeenCalledTimes(3);
  });
});
