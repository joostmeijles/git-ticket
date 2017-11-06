const debug = require('debug')('debug');
const JiraClient = require('jira-connector');

function createClient(configFile) {
    return new JiraClient(require(configFile));
}

function getIssue(client, key) {
    return client.issue.getIssue({issueKey: key})
        .then(issue => Promise.resolve({key:key, issue:issue}))
        .catch(error => {
            debug(error);
            return Promise.resolve({key:key, issue:null});
        }); 
}

function editIssue(client, key, issue) {
    return client.issue.editIssue({issueKey: key, issue: issue})
        .then(_ => Promise.resolve(true))
        .catch(error => {
            debug(error);
            return Promise.resolve(false);
        });
}

module.exports = {
    createClient: createClient,
    getIssue: getIssue,
    editIssue: editIssue
}
