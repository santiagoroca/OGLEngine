#!/usr/bin/env node

const program = require('commander');
const ogl = require('./ogl')
 
program
    .command('compile <filename>')
    .option('-l, --loglevel <n>', 'An integer argument', parseInt)
    .action((filename, options) => ogl(filename, options.loglevel))
 
program.parse(process.argv);