const path = require('path');
const { fileService } = require('./file');
const minifyService = require('./minify');

describe('Minify Service', () => {
  function getSampleFilepathByExtension(extension){
    return path.join(__dirname, `../mocks/sample.${extension}`);
  }

  function getSampleFileByExtension(extension){
    return fileService.readSync(getSampleFilepathByExtension(extension));
  }

  it('should minify html', () => {
    const markup = getSampleFileByExtension('html');
    expect(minifyService.minifyHTML(markup)).toEqual('<p>This is a paragraph.</p>');
  });

  it('should minify css', () => {
    const styles = getSampleFileByExtension('css');
    expect(minifyService.minifyCSS(styles)).toEqual('body,html{margin:0}');
  });

  it('should minify javascript', () => {
    const code = getSampleFileByExtension('js');
    expect(minifyService.minifyJS(code)).toEqual('function sum(n,u){return n+u}');
  });

  it('should minify file according its filepath', () => {
    const jsFilepath = getSampleFilepathByExtension('js');
    const cssFilepath = getSampleFilepathByExtension('css');
    const htmlFilepath = getSampleFilepathByExtension('html');
    expect(minifyService.minifyByFilepath(jsFilepath)).toEqual('function sum(n,u){return n+u}');
    expect(minifyService.minifyByFilepath(cssFilepath)).toEqual('body,html{margin:0}');
    expect(minifyService.minifyByFilepath(htmlFilepath)).toEqual('<p>This is a paragraph.</p>');
  });

  it('should just return file contents not minified if file is not "minifiable"', () => {
    const nonMinifiableFilepath = path.join(__dirname, '../mocks/new-year.md');
    const nonMinifiableFile = fileService.readSync(nonMinifiableFilepath);
    const result = minifyService.minifyByFilepath(nonMinifiableFilepath);
    expect(result).toEqual(nonMinifiableFile);
  });
});
