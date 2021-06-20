const fs = require('fs');
const path = require('path');
const docService = require('./doc');

describe('Doc Service', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should log documentation for a command', () => {
    const buildHelpText = fs.readFileSync(path.join(__dirname, '../docs/build.txt'), 'utf-8');
    docService.log('build');
    expect(console.log).toHaveBeenCalledWith(buildHelpText);
  });

  it('should identify help flag', () => {
    expect(docService.isHelpFlag('-h')).toEqual(true);
    expect(docService.isHelpFlag('--help')).toEqual(true);
  });

  it('should identify version flag', () => {
    expect(docService.isVersionFlag('-v')).toEqual(true);
    expect(docService.isVersionFlag('--version')).toEqual(true);
  });

  it('should log unknown option', () => {
    const command = 'build';
    const option = 'whatever';
    docService.logUnknownOption(command, option);
    expect(console.log).toHaveBeenCalledWith(
      `Unknown option "${option}". Try "triven ${command} --help" to see available options.`
    );
  });
});
