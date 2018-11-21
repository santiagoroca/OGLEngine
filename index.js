#!/usr/bin/env node

const program = require('commander');
const ogl = require('./ogl')
 
program
    .command('compile <filename>')
    .action((filename, cmd) => ogl(filename))
 
program.parse(process.argv);