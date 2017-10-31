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

module.exports = {
    createClient: createClient,
    getIssue: getIssue
}
