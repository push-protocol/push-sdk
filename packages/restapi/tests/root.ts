export const mochaHooks = {
  // This file is needed to end the test suite.
  afterAll(done: () => void) {
    done();
    console.log('     ALL TEST CASES EXECUTED     ');
    process.exit(0);
  },
};
