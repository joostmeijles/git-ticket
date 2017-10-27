const debug = require('debug')('debug');
const JiraClient = require('jira-connector');

function createClient(configFile) {
    return new JiraClient(require(configFile));
}

function getIssueSummary(client, issueKey, cb) {
    client.issue.getIssue({issueKey: issueKey}, 
        function (error, issue) {
            if (error) {
                debug(error);
                cb('');
                return;
            }

            debug(`${issueKey} ${issue.fields.summary}`);
            cb(issue.fields.summary);
    });
}

module.exports = {
    createClient: createClient,
    getIssueSummary: getIssueSummary
}
