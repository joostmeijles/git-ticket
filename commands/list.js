const git = require('../git');
const jira = require('../jira');
const Promise = require('bluebird');

let jiraClient = null;

function printSummaryLine({key, issue}) {
    if (issue) {
        console.log(`${key} ${issue.fields.summary}`);
    } else {
        console.log(`${key}`);
    }
}

function handleLog(log) {
    const ids = git.findIdsInLog(log);

    if (jiraClient) {
        Promise.map(ids, id => jira.getIssue(jiraClient, id), {concurrency: 3})
            .then(issues => {
                issues.sort((a, b) => a.key.localeCompare(b.key));
                issues.map(issue => printSummaryLine(issue));
            });
    } else {
        ids.sort();
        ids.map(id => printSummaryLine({key:id}));
    }
}

// eslint-disable-next-line camelcase
function list({from, to, jira_config}) {
    if (jira_config) { // eslint-disable-line camelcase
        jiraClient = jira.createClient(jira_config);
    }

    console.log(`Listing from ${from} to ${to}`);

    const options = {from: from, to: to};
    git.getLog(options, (log) => handleLog(log));
}

module.exports = list;
