const assert = require('assert');
const debug = require('debug')('debug');
const git = require('simple-git');
const {spawnSync} = require('child_process');
const reverse = require('reverse-string');

function findIdsInString(str) {
    // Regex with LookAhead, so reverse input string
    const matcher = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;

    const revStr = reverse(str);
    let matches = revStr.match(matcher);
    if (!matches) {
        debug(`"${str}" contains no Jira ticket number`);
        return [];
    }

    matches = matches.map((match) => reverse(match)).reverse();

    debug(`"${str}" contains ${matches}`);
    return matches;
}

function findIdsInLog(log) {
    const linesWithIds = log.all.map((line) => findIdsInString(line.message));
    const ids = [].concat(...linesWithIds);
    const uniqueIds = Array.from(new Set(ids));
    return uniqueIds;
}

function getLog(options, cb) {
    git().log(options, (err, log) => { 
        if (log) { 
            cb(log);
        } else { 
            debug(err); 
        } 
    });
}

const versionRegex = '[0-9]*\\.[0-9]*\\.[0-9]*'

function getPrevTag(from) {
    const res = spawnSync('git', [
        'describe',
        '--tags', 
        '--abbrev=0',
        `--match=${versionRegex}`,
        `${from}^`
    ]);
    
    // eslint-disable-next-line no-magic-numbers
    assert.equal(res.status, 0, `Failed to find previous tag from ${from}`);
    
    const tag = res.stdout.toString().trim();
    return tag;
}

function getCurrentTag() {
    const res = spawnSync('git', [
        'describe',
        '--tags', 
        '--exact-match',
        `--match=${versionRegex}`
    ]);
    
    // eslint-disable-next-line no-magic-numbers
    assert.equal(res.status, 0, 'Failed to find current tag');
    
    const tag = res.stdout.toString().trim();
    return tag;
}

module.exports = {
    findIdsInLog: findIdsInLog,
    getLog: getLog,
    getCurrentTag: getCurrentTag,
    getPrevTag: getPrevTag
}
