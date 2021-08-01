const path = require('path');
const { fileService } = require('./file');
const metadataService = require('./metadata');

describe('Metadata Service', () => {
  function readMockFile(filename){
    return fileService.readSync(path.join(__dirname, `../mocks/${filename}`));
  }

  it('should detect if metadata is present on file', () => {
    expect(metadataService.hasMetadata(readMockFile('brazil.md'))).toEqual(true);
    expect(metadataService.hasMetadata(readMockFile('images.md'))).toEqual(false);
  });
});
