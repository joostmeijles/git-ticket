#!/usr/bin/env node
const cli = require('./cli');
const git = require('./git');
const jira = require('./jira');
const path = require('path');

function printIssueLine(keyIssue) {
    const {key, issue} = keyIssue;
    if (issue) {
        console.log(`${key} ${issue.fields.summary}`);

        const fixVersions = issue.fields.fixVersions;
        const releases = fixVersions.map(v => v.name).join(' ');
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

function list(args) {
    let jiraClient = null;
    if (args.jira_config) {
        const configFile = path.resolve(args.jira_config);
        jiraClient = jira.createClient(configFile);
    }

    const options = {from: args.from, to: args.to};
    git.getLog(options, (log) => handleLog(log, jiraClient));
}

function verify(args) {
    console.log('Not implemented');
}

cli(list, verify);
