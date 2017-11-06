#!/usr/bin/env node
const cli = require('./cli');
const colors = require('colors');
const git = require('./git');
const jira = require('./jira');
const path = require('path');

let jiraClient = null;

function printSummaryLine(keyIssue) {
    const {key, issue} = keyIssue;
    if (issue) {
        console.log(`${key} ${issue.fields.summary}`);

        const fixVersions = issue.fields.fixVersions;
        const releases = fixVersions.map(v => v.name).join(', ');
    } else {
        console.log(`${key}`);
    }
}

function updateFixVersions(key, fixVersions, newFixVersion) {
    const prevReleases = fixVersions.map(v => v.name).join(', ');
    fixVersions.push({name: newFixVersion});

    const editIssue = {
        fields: {
            fixVersions: fixVersions
        }
    };

    jira.editIssue(jiraClient, key, editIssue).then(
        res => {
            if (res) {
                const newReleases = fixVersions.map(v => v.name).join(', ');
                console.log(`${key} ${newReleases}`.yellow);
            } else {
                console.log(`${key} ${prevReleases}`.red);
            }
        }
    );
}

function printReleaseLine(keyIssue, args) {
    const {key, issue} = keyIssue;
    if (issue) {
        const fixVersions = issue.fields.fixVersions;
        const releases = fixVersions.map(v => v.name).join(', ');

        const found = fixVersions.find(v => v.name == args.release);

        if (found) {
            console.log(`${key} ${releases}`.green);
        } else {
            updateFixVersions(key, fixVersions, args.release); 
        }
    } else {
        updateFixVersions(key, [], args.release);
    }
}

function handleLog(log, jiraClient, printer, args) {
    const ids = git.findIdsInLog(log);

    if (jiraClient) {
        Promise.all(
            ids.map(id => jira.getIssue(jiraClient, id))
        ).then(issues => {
            issues.sort((a, b) => (a.key).localeCompare(b.key));
            issues.map(issue => printer(issue, args));
        });
    } else {
        ids.sort();
        ids.map(id => printer({key:id}, args));
    }
}

function getLog(args, printer) {
    if (args.jira_config) {
        const configFile = path.resolve(args.jira_config);
        jiraClient = jira.createClient(configFile);
    }

    const options = {from: args.from, to: args.to};
    git.getLog(options, (log) => handleLog(log, jiraClient, printer, args));
}

function list(args) {
    getLog(args, printSummaryLine);
}

function update(args) {
    getLog(args, printReleaseLine);
}

cli(list, update);
