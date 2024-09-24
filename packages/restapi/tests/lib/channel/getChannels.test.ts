import { getChannels } from '../../../src/lib/channels/getChannels';
import { ENV } from '../../../src/lib/constants';
import { expect } from 'chai';

describe('PUSH_CHANNELS.getChannels', () => {
  it('Should fetch channels based on the filter', async () => {
    const res = await getChannels({
      filter: 80002,
      env: ENV.DEV,
    });
    console.log(res);
  });
});
