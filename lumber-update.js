const program = require('commander');
const chalk = require('chalk');
const logger = require('./services/logger');
const Prompter = require('./services/prompter');
const update = require('./app/update');

async function main() {
  try {
    await run();
    console.log(chalk.green('Your admin is up to date.'));
    process.exit(0);
  } catch (err) {
    logger.error('💀  Oops, operation aborted 💀 due to the following error: ', err);
    process.exit(1);
  }
}

async function run() {
  program
    .description('Update your models\' definition according to your database schema')
    .option('-c, --connection-url', 'Enter the database credentials with a connection URL')
    .option('-d, --source-directory <sourceDirectory>', 'The directory of your back office generated by Lumber')
    .parse(process.argv);

  if (process.env.DATABASE_URL) {
    program.connectionUrl = true;
  }

  const config = await Prompter(program, [
    'dbConnectionUrl',
    'dbDialect',
    'dbName',
    'dbSchema',
    'dbHostname',
    'dbPort',
    'dbUser',
    'dbPassword',
    'dbStorage',
    'mongodbSrv',
    'ssl',
  ]);

  return update(config);
}

main();

