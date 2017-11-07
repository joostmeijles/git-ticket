#!/usr/bin/env node
const cli = require('./cli');
const list = require('./commands/list');
const add = require('./commands/add');

cli(list, add);
