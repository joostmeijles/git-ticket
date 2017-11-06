// Parse command-line options
const ArgumentParser = require('argparse').ArgumentParser;

const parser = new ArgumentParser({
    version: require('./package.json').version,
    addHelp: true,
    description: 'Get JIRA ticket information from the Git log of the currently active branch, starting from tag until to tag.'
});

const subparsers = parser.addSubparsers({
    dest: 'subcommand_name'
});

// ls sub-command
const ls = subparsers.addParser('list', {
    addHelp: true,
    aliases: ['ls'],
    description: 'List all JIRA tickets'
});
ls.addArgument('from', {help: 'Git tag to start from (excluded)'});
ls.addArgument('to', {help: 'Git tag to end with (included)'});
ls.addArgument(
    '--jira-config', 
    {help: 'JSON file containing Jira connection details and authentication credentials, see: jira_example_config.json and https://www.npmjs.com/package/jira-connector'}
);
ls.setDefaults();

const update = subparsers.addParser('update', {
    addHelp: true,
    aliases: ['up'],
    description: 'Update release information in JIRA administration'
});
update.addArgument('from', {help: 'Git tag to start from (excluded)'});
update.addArgument('to', {help: 'Git tag to end with (included)'});
update.addArgument('release', {help: 'JIRA release to add found tickets to'})
update.addArgument(
    '--jira-config', 
    {
        help: 'JSON file containing Jira connection details and authentication credentials, see: jira_example_config.json and https://www.npmjs.com/package/jira-connector',
        required: true
    }
);

function handle(list, update) {
    const args = parser.parseArgs();
    
    switch(args.subcommand_name) {
        case 'list':
        case 'ls':
            return list(args);
        case 'update':
        case 'up':
            return update(args);
    }
}

module.exports = handle;