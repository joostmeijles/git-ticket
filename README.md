# git-ticket [![Build Status](https://travis-ci.org/joostmeijles/git-ticket.svg?branch=master)](https://travis-ci.org/joostmeijles/git-ticket) [![npm version](https://badge.fury.io/js/git-ticket.svg)](https://badge.fury.io/js/git-ticket)
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
To retrieve all JIRA tickets that are present in commit messages starting from the previous tag (automatically determined) until Git tag version 2 (v2Tag):
```
$ get-ticket list v2Tag
Listing from v2Tag to v3Tag
JIRA-1
```
JIRA ticket numbers are written to standard output.

## List tickets and retrieve summary info from JIRA
The JIRA ticket summary can be automatically when a JIRA configuration file is found. Either use the default `.jiraconfig` or pass a custom file using the `--jira-config` option:
```
$ get-ticket ls v3Tag --jira-config jira_example_config.json
Listing from v3Tag to 0.2.1
GIT-1 First test story
GIT-2
JIRA-1
```
The JSON file contains the Jira connection details and authentication credentials to use, see jira_example_config.json and https://www.npmjs.com/package/jira-connector for details.

## Add fix version in JIRA
To add fix version `0.2.1` for all tickets found from the latest tag till `0.2.1`:
```
$ git-ticket add 0.2.1
Adding fix-version 0.2.1, from 0.2.1 to 0.1
GIT-1 0.1, 0.2.1
GIT-2 0.2.1
```
By default the `to` tag is used a fix version value, to override use the `--fix-version` option.

Line colors mean:
- green: no update needed, already has fix version
- yellow: added fix version
- red: failed to update fix version

## Automatically determining the previous tag
The previous tag is determined by using `git describe`, it finds the first matching tag from the given `to` tag. Only tags that match the following semantic versioning regex `[0-9]*\.[0-9]*\.[0-9]*` are used.
