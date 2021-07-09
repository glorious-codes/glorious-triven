const { fileService } = require('./file');
const stylesService = require('./styles');

describe('Styles Service', () => {
  function mockHtmlString(){
    return '<!DOCTYPE html><html><head></head><body></body></html>';
  }

  function getExpectedHash(){
    return '967ef52e0a47578986ae49cff68b82ad';
  }

  beforeEach(() => {
    fileService.write = jest.fn();
  });

  it('should compile and copy base styles to the output directory', done => {
    const outputDirectory = 'some/output/dir';
    stylesService.buildBaseStyle(outputDirectory, () => {
      const expectedFilepath = `${outputDirectory}/assets/triven-${getExpectedHash()}.css`;
      expect(fileService.write).toHaveBeenCalledWith(expectedFilepath, expect.any(String));
      done();
    });
  });

  it('should append base stylesheet in a given html string', () => {
    const htmlString = mockHtmlString();
    expect(stylesService.appendBaseStylesheet(htmlString)).toContain(
      `<link rel="stylesheet" href="assets/triven-${getExpectedHash()}.css">`
    );
  });

  it('should optionally append base stylesheet with a prefix in a given html string', () => {
    const htmlString = mockHtmlString();
    expect(stylesService.appendBaseStylesheet(htmlString, { hrefPrefix: '../' })).toContain(
      `<link rel="stylesheet" href="../assets/triven-${getExpectedHash()}.css">`
    );
  });
});
