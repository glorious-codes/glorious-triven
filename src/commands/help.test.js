const pkg = require('../../package.json');
const command = require('./help');

const HELP_DOC = `Usage: triven <args>

  { description }

Commands:
  build                 Process markdown files and generates a blog

Options:
  -v  --version         Display current software version
  -h  --help            Display software help and usage details
`;

describe('Help Command', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should log doc if help flag has been given', () => {
    command.exec();
    const doc = HELP_DOC.replace('{ description }', pkg.description);
    expect(console.log).toHaveBeenCalledWith(doc);
  });
});
