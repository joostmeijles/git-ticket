#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser;
const git = require('./git');
const jira = require('./jira');
const path = require("path");

function printIssueLine(id, summary) {
    if (summary) {
        console.log(`${id} ${summary}`);
    } else {
        console.log(`${id}`);
    }
}

function handleLog(log, jiraClient) {
    const ids = git.findIdsInLog(log);

    if (jiraClient) {
        ids.map(id => jira.getIssueSummary(jiraClient, id, (summary) => printIssueLine(id, summary)));
    } else {
        ids.map(id => printIssueLine(id));
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
    '--jira_config', 
    {help: 'JSON file containing Jira connection details and authentication credentials, see: jira_example_config.json and https://www.npmjs.com/package/jira-connector'});
const args = parser.parseArgs();

let jiraClient = null;
if (args.jira_config) {
    const configFile = path.resolve(args.jira_config);
    jiraClient = jira.createClient(configFile);
}

const options = {from: args.from, to: args.to};
git.getLog(options, (log) => handleLog(log, jiraClient));
