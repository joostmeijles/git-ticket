# git-ticket
Get JIRA tickets from the Git commit log.

Supported actions are:
- listing JIRA tickets from Git commit messages
- listing JIRA tickets and retrieving summary info from JIRA
- adding fix versions in JIRA for all found tickets

To install:
```
$ npm install git-ticket
```

## List tickets from Git commit message
To retrieve all JIRA tickets that are present in commit messages starting after Git tag version 1 (v1Tag) until Git tag version 2 (v2Tag):
```
$ get-ticket list v1Tag v2Tag
JIRA-1
```
JIRA ticket numbers are written to standard output.

## List tickets and retrieve summary info from JIRA
The JIRA ticket summary can be automatically retrieved by passing the `--jira-config` option:
```
$ get-ticket ls v1Tag v3Tag --jira-config jira_example_config.json
GIT-1 First test story
GIT-2
JIRA-1
```
The JSON file contains the Jira connection details and authentication credentials to use, see jira_example_config.json and https://www.npmjs.com/package/jira-connector for details.

## Add fix version in JIRA
To add fix version `0.1` for all tickets found from `v2Tag` till `HEAD`:
```
$ git-ticket add 0.2 v2Tag HEAD --jira-config=jira.json
GIT-1 0.1, 0.2
GIT-2 0.2
```
Lines printed:
- green: no update needed, already has fix version
- yellow: added fix version
- red: failed to update fix version
