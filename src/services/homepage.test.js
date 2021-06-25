const postsMock = require('../mocks/posts');
const { fileService } = require('./file');
const pageService = require('./page');
const homepageService = require('./homepage');

describe('Homepage Service', () => {
  function stubPageBuild(content){
    pageService.build = jest.fn(() => content);
  }

  beforeEach(() => {
    fileService.write = jest.fn();
    pageService.build = jest.fn();
  });

  it('should build pages ordered by descending date', () => {
    const [first, second, third] = postsMock;
    homepageService.build(postsMock, '');
    expect(pageService.build).toHaveBeenCalledWith([second, third, first], {
      page: 1,
      total: 1
    });
  });

  it('should consider first page as homepage index', () => {
    const outputDirectory = 'some/output/dir';
    const pageMock = 'some article html';
    stubPageBuild(pageMock);
    homepageService.build(postsMock, outputDirectory);
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/index.html`, pageMock);
  });

  it('should save pages other than index in their appropriate directory', () => {
    const outputDirectory = 'some/output/dir';
    const postsMock = new Array(25);
    const pageMock = 'some article html';
    stubPageBuild(pageMock);
    homepageService.build(postsMock.fill({ some: 'postSummary' }), outputDirectory);
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/p/2.html`, pageMock);
    expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/p/3.html`, pageMock);
  });
});
