const debug = require('debug')('debug');
const git = require('simple-git');
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

module.exports = {
    findIdsInLog: findIdsInLog,
    getLog: getLog
}
