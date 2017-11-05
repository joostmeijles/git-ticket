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

const check = subparsers.addParser('verify', {
    addHelp: true,
    description: 'Verify if release information matches with JIRA administration'
});
check.addArgument('from', {help: 'Git tag to start from (excluded)'});
check.addArgument('to', {help: 'Git tag to end with (included)'});
check.addArgument(
    '--jira-config', 
    {
        help: 'JSON file containing Jira connection details and authentication credentials, see: jira_example_config.json and https://www.npmjs.com/package/jira-connector',
        required: true
    }
);

function handle(list, verify) {
    const args = parser.parseArgs();
    
    switch(args.subcommand_name) {
        case 'list':
        case 'ls':
            return list(args);
        case 'verify':
            return verify(args);
    }
}

module.exports = handle;