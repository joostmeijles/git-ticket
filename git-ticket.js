#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser;
const git = require('simple-git');
const log = require('debug')('log');
const reverse = require('reverse-string');

function findIdsInString(str) {
    // Regex with LookAhead, so reverse input string
    const matcher = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;

    const revStr = reverse(str);
    let matches = revStr.match(matcher);
    if (!matches) {
        log(`"${str}" contains no Jira ticket number`);
        return [];
    }

    matches = matches.map((match) => reverse(match)).reverse();

    log(`"${str}" contains ${matches}`);
    return matches;
}

function findIdsInLog(log) {
    linesWithIds = log.all.map((line) => findIdsInString(line.message));
    ids = [].concat(...linesWithIds);
    return ids;
}

function printIds(ids) {
    ids.map(id => console.log(id));
}

function handle(err, log) {
    if (log) {
        printIds(findIdsInLog(log));
    }
}

const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Get JIRA tickets from the Git log of the currently active branch, starting from tag until to tag.'
});

parser.addArgument('from', {help: 'Git tag to start from (not included)'});
parser.addArgument('to', {help: 'Git tag to end with (included)'});
const args = parser.parseArgs();

const options = {from: args.from, to: args.to};
git().log(options, handle);
