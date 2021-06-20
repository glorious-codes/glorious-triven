const fs = require('fs');
const path = require('path');
const { fileService } = require('./file');
const configService = require('./config');
const dateService = require('./date');
const domService = require('./dom');
const buildService = require('./build');

describe('Build Service', () => {
  function buildPathToMarkdownMock(){
    return path.join(__dirname, '../mocks/new-year.md');
  }

  beforeEach(() => {
    console.log = jest.fn();
    fileService.write = jest.fn((path, data, onSuccess) => onSuccess && onSuccess());
  });

  it('should create a demo post if no markdown files have been found on source directory', done => {
    fileService.collect = jest.fn((pattern, onSuccess) => {
      const filepaths = fileService.collect.mock.calls.length === 1 ? [] : [buildPathToMarkdownMock()];
      onSuccess(filepaths);
    });
    const post = fs.readFileSync(path.join(__dirname, '../templates/post.md'), 'utf-8');
    const date = dateService.buildTodayISODate();
    const { sourceDirectory } = configService.get();
    buildService.init(() => {
      expect(console.log).toHaveBeenCalledWith('Building files...');
      expect(fileService.collect).toHaveBeenCalledWith(`${sourceDirectory}/**/*.md`, expect.any(Function));
      expect(fileService.write).toHaveBeenCalledWith(`${sourceDirectory}/hello-world.md`, post.replace('{date}', date), expect.any(Function));
      expect(console.log).toHaveBeenCalledWith('Files successfully built!');
      done();
    });
  });

  it('should convert markdown files to html files if markdown files have been found on source directory', done => {
    fileService.collect = jest.fn((pattern, onSuccess) => onSuccess([buildPathToMarkdownMock()]));
    const data = domService.minifyHTML(`
<!DOCTYPE html>
<html dir="ltr" lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <title>New year!</title>
  </head>
  <body>
    <article>
      <header>
        <h1>New year!</h1>
        <p>1/1/2022</p>
      </header>
      <p>Happy new year!</p>
    </article>
  </body>
</html>
`.trim());
    const { sourceDirectory, outputDirectory } = configService.get();
    buildService.init(() => {
      expect(fileService.write).not.toHaveBeenCalledWith(`${sourceDirectory}/hello-world.md`, expect.any(String));
      expect(fileService.write).toHaveBeenCalledWith(`${outputDirectory}/new-year.html`, data);
      done();
    });
  });
});
