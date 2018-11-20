#!/usr/bin/env node

const execSync = require('child_process').execSync;
const program = require('commander');
 
program
    .command('compile <filename>')
    .action((filename, cmd) => execSync(`node ${__dirname}/ogl.js ${filename}`))
 
program.parse(process.argv);