const git = require('../git');
const jira = require('../jira');

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
        Promise.all(ids.map(id => jira.getIssue(jiraClient, id))).then(issues => {
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

    const options = {from: from, to: to};
    git.getLog(options, (log) => handleLog(log));
}

module.exports = list;
