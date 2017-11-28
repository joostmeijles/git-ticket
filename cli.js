// Parse command-line options
const assert = require('assert');
const argparse = require('argparse');
const findConfig = require('find-config');
const git = require('./git');

const parser = new argparse.ArgumentParser({
    version: require('./package.json').version,
    addHelp: true,
    prog: 'git ticket',
    description: 'Get JIRA ticket information from the Git log of the currently active branch, starting from tag until to tag.'
});

const subparsers = parser.addSubparsers({
    dest: 'subcommand_name'
});

function addDefaultArgs(subparser) {
    subparser.addArgument('--from', {
        help: 'Git tag to start from (excluded).'
    });
    subparser.addArgument('to', {help: 'Git tag to end with (included).'});
    subparser.addArgument('--jira-config', {   
        defaultValue: findConfig('.jiraconfig'),
        help: 'JSON file containing JIRA connection details and authentication credentials, see: jira_example_config.json and https://www.npmjs.com/package/jira-connector. Uses the first matching config file with given name, see: https://www.npmjs.com/package/find-config for search order.'
    });
}

// ls sub-command
const ls = subparsers.addParser('list', {
    addHelp: true,
    aliases: ['ls'],
    description: 'List all JIRA tickets',
    formatterClass: argparse.ArgumentDefaultsHelpFormatter
});
addDefaultArgs(ls);

// add sub-command
const add = subparsers.addParser('add', {
    addHelp: true,
    description: 'Add fix version to JIRA for all found tickets, by default the <to> tag is used as fix version.',
    formatterClass: argparse.ArgumentDefaultsHelpFormatter
});
addDefaultArgs(add);
add.addArgument('--fix-version', {
    help: 'Fix version to add to found tickets.'
});

function handle(listCommand, addCommand) {
    const args = parser.parseArgs();
    
    if (!args.from) {
        args.from = git.getPrevTag(args.to);
    }
    
    switch(args.subcommand_name) {
        case 'list':
        case 'ls':
            return listCommand(args);
        case 'add':
            assert.ok(args.jira_config, 'No JIRA config file found');
            return addCommand(args);
    }
}

module.exports = handle;
