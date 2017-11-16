const debug = require('debug')('debug');
const fs = require('fs');
const JiraClient = require('jira-connector');

function requireJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath));
}

function createClient(configFile) {
    return new JiraClient(requireJson(configFile));
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
        .then(() => Promise.resolve(true))
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
