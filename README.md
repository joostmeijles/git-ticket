# git-ticket
Get JIRA tickets from the Git log of the currently active branch, starting from tag until to tag.

To install:
```
$ npm install git-ticket
```

Example to retrieve all JIRA tickets that are present in commit messages starting after Git tag version 1 (v1Tag) until Git tag version 2 (v2Tag):
```
$ get-ticket v1Tag v2Tag
JIRA-1
```
JIRA ticket numbers are written to standard output.
