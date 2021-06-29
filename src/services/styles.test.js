const { fileService } = require('./file');
const stylesService = require('./styles');

describe('Styles Service', () => {
  beforeEach(() => {
    fileService.write = jest.fn();
  });

  function mockHtmlString(){
    return '<!DOCTYPE html><html><head></head><body></body></html>';
  }

  it('should compile and copy base styles to the output directory', done => {
    const outputDirectory = 'some/output/dir';
    stylesService.buildBaseStyle(outputDirectory, () => {
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/assets/triven.css`, expect.any(String));
      done();
    });
  });

  it('should append base stylesheet in a given html string', () => {
    const htmlString = mockHtmlString();
    expect(stylesService.appendBaseStylesheet(htmlString)).toContain('<link rel="stylesheet" href="assets/triven.css">');
  });

  it('should optionally append base stylesheet with a prefix in a given html string', () => {
    const htmlString = mockHtmlString();
    expect(stylesService.appendBaseStylesheet(htmlString, { hrefPrefix: '../' })).toContain('<link rel="stylesheet" href="../assets/triven.css">');
  });
});
