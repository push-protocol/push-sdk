import chalk = require('chalk');

export const mochaHooks = {
  // This file is needed to end the test suite.
  afterAll(done: () => void) {
    done();
    console.log(chalk.bold.green.inverse('     ALL TEST CASES EXECUTED     '));
    process.exit(0);
  },
};
