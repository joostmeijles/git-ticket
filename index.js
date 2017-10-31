#!/usr/bin/env node
const ArgumentParser = require('argparse').ArgumentParser;
const git = require('./git');
const jira = require('./jira');
const path = require("path");

function printIssueLine(keyIssue) {
    const {key, issue} = keyIssue;
    if (issue) {
        console.log(`${key} ${issue.fields.summary}`);
    } else {
        console.log(`${key}`);
    }
}

function handleLog(log, jiraClient) {
    const ids = git.findIdsInLog(log);

    if (jiraClient) {
        Promise.all(
            ids.map(id => jira.getIssue(jiraClient, id))
        ).then(issues => {
            issues.sort((a, b) => (a.key).localeCompare(b.key));
            issues.map(printIssueLine);
        });
    } else {
        ids.sort();
        ids.map(id => printIssueLine({key:id}));
    }
}

const parser = new ArgumentParser({
    version: require('./package.json').version,
    addHelp: true,
    description: 'Get JIRA tickets from the Git log of the currently active branch, starting from tag until to tag.'
});

parser.addArgument('from', {help: 'Git tag to start from (not included)'});
parser.addArgument('to', {help: 'Git tag to end with (included)'});
parser.addArgument(
    '--jira-config', 
    {help: 'JSON file containing Jira connection details and authentication credentials, see: jira_example_config.json and https://www.npmjs.com/package/jira-connector'});
const args = parser.parseArgs();

let jiraClient = null;
if (args.jira_config) {
    const configFile = path.resolve(args.jira_config);
    jiraClient = jira.createClient(configFile);
}

const options = {from: args.from, to: args.to};
git.getLog(options, (log) => handleLog(log, jiraClient));
