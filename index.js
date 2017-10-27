#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser;
const git = require('simple-git');
const jira = require('./jira');
const log = require('debug')('log');
const path = require("path");
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
    const ids = [].concat(...linesWithIds);
    const uniqueIds = Array.from(new Set(ids));
    return uniqueIds;
}

function printIds(ids, jiraClient) {
    if (jiraClient) {
        ids.map(id => jira.getIssueSummary(jiraClient, id));
    }
    ids.map(id => console.log(id));
}

function handle(err, log, jiraClient) {
    if (log) {
        printIds(findIdsInLog(log), jiraClient);
    }
}

const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Get JIRA tickets from the Git log of the currently active branch, starting from tag until to tag.'
});

parser.addArgument('from', {help: 'Git tag to start from (not included)'});
parser.addArgument('to', {help: 'Git tag to end with (included)'});
parser.addArgument(
    '--jira_auth_config', 
    {help: 'Jira config JSON authentication file, holding the authentication JSON object for creating a JIRA client: https://www.npmjs.com/package/jira-connector'});
const args = parser.parseArgs();

let jiraClient = null;
if (args.jira_auth_config) {
    const configFile = path.resolve(args.jira_auth_config);
    jiraClient = jira.createClient(configFile);
}

const options = {from: args.from, to: args.to};
git().log(options, (err, log) => handle(err, log, jiraClient));
