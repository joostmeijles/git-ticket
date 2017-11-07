#!/usr/bin/env node
const colors = require('colors');
const git = require('../git');
const jira = require('../jira');
const path = require('path');

let jiraClient = null;

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

function handleReleaseLine({key, issue}, version) {
    if (issue) {
        const fixVersions = issue.fields.fixVersions;
        const releases = fixVersions.map(v => v.name).join(', ');

        const foundRelease = fixVersions.find(v => v.name == version);
        if (foundRelease) {
            console.log(`${key} ${releases}`.green);
        } else {
            updateFixVersions(key, fixVersions, version); 
        }
    } else {
        console.log(`${key}`.red);
    } 
}

function handleLog(log, version) {
    const ids = git.findIdsInLog(log);

    Promise.all(
        ids.map(id => jira.getIssue(jiraClient, id))
    ).then(issues => {
        issues.map(issue => handleReleaseLine(issue, version));
    });
}

function add({from, to, jira_config, version}) {
    const configFile = path.resolve(jira_config);
    jiraClient = jira.createClient(configFile);

    const options = {from: from, to: to};
    git.getLog(options, (log) => handleLog(log, version));
}

module.exports = add;
