#!/usr/bin/env node
const argsService = require('./services/args');
const commands = require('./commands');

const HELPER_TEXT = 'Try "triven --help" to see available commands.';

const _public = {};

_public.init = () => {
  const args = argsService.getCliArgs();
  const commandName = args[0];
  if(commandName)
    return handleCommand(commandName, args);
  return console.log(`No command given. ${HELPER_TEXT}`);
};

function handleCommand(commandName, args){
  const command = commands[commandName];
  if(command)
    return command.exec(args.slice(1));
  return console.log(`Unknown command "${commandName}". ${HELPER_TEXT}`);
}

_public.init();

module.exports = _public;
