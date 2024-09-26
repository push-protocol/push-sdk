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

  it('Should fetch channels based on the filter and tags', async () => {
    const res = await getChannels({
      env: ENV.DEV,
      tag: 'Infrastructure'
    });
    console.log(res.channels[0]);
  });
});
