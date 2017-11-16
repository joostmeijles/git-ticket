#!/usr/bin/env node
const cli = require('./cli');
const list = require('./commands/list');
const add = require('./commands/add');

try {
    cli(list, add);
} catch (e) {
    process.exitcode = 1;
    console.log(`Error: ${e.message}`);
}
