import { EmbedSDK } from './embedsdk'

const originalConsole = console;

beforeEach(() => {
  console.error = () => {
    // do nothing
  };

  console.log = () => {
    // do nothing
  };

  console.info = () => {
    // do nothing
  };
})

afterEach(() => {
  console = originalConsole;
});

describe('EmbedSDK', () => {
  describe('init()', () => {
    it('init() is defined', () => {
      expect(EmbedSDK.init).toBeDefined()
    })

    it('init() should throw error if "user" is not passed', () => {
      const success = EmbedSDK.init({
        targetID: 'xyz', // MANDATORY
        chainId: 1,
        appName: 'appName', // MANDATORY
        user: '', // MANDATORY
        headerText: 'Notifications',
        viewOptions: {}
      });

      expect(success).toBe(false);
    })

    it('init() should throw error if "chainId" is not passed/supported', () => {
      const success =  EmbedSDK.init({
        targetID: 'xyz', // MANDATORY
        chainId: 0,
        appName: 'appName', // MANDATORY
        user: '0xabc', // MANDATORY
        headerText: 'Notifications',
        viewOptions: {}
      });

      expect(success).toBe(false);
    })

    it('init() should throw error if "targetID" is not passed', () => {

      const success = EmbedSDK.init({
        targetID: '', // MANDATORY
        chainId: 1,
        appName: 'appName', // MANDATORY
        user: '0xabc', // MANDATORY
        headerText: 'Notifications',
        viewOptions: {}
      });

      expect(success).toBe(false);
    })

    it('init() should throw error if "appName" is not passed', () => {
      const success = EmbedSDK.init({
        targetID: 'xyz', // MANDATORY
        chainId: 1,
        appName: '', // MANDATORY
        user: '0xabc', // MANDATORY
        headerText: 'Notifications',
        viewOptions: {}
      });

      expect(success).toBe(false);
    })
  });

  it('cleanup() is defined', () => {
    expect(EmbedSDK.cleanup).toBeDefined()
  })
});
