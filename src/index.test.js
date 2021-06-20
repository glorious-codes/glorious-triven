const argsService = require('./services/args');
const commands = require('./commands');

const HELPER_TEXT = 'Try "triven --help" to see available commands.';

describe('CLI Index', () => {
  let cli;

  function stubGetCLIArgs(args){
    argsService.getCliArgs = jest.fn(() => args);
  }

  beforeEach(() => {
    console.log = jest.fn();
    argsService.getCliArgs = jest.fn(() => []);
    commands.build.exec = jest.fn();
    cli = require('./index');
  });

  it('should exec build command', () => {
    stubGetCLIArgs(['build']);
    cli.init();
    expect(commands.build.exec).toHaveBeenCalled();
  });

  it('should pass remaining args on command execution', () => {
    stubGetCLIArgs(['build', '--watch']);
    cli.init();
    expect(commands.build.exec).toHaveBeenCalledWith(['--watch']);
  });

  it('should log unkown command', () => {
    const command = 'whatever';
    stubGetCLIArgs([command]);
    cli.init();
    expect(console.log).toHaveBeenCalledWith(
      `Unknown command "${command}". ${HELPER_TEXT}`
    );
  });

  it('should log no command given', () => {
    stubGetCLIArgs([]);
    cli.init();
    expect(console.log).toHaveBeenCalledWith(
      `No command given. ${HELPER_TEXT}`
    );
  });
});
