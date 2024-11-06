import { search } from '../../../src/lib/channels/search';
import { ENV } from '../../../src/lib/constants';
import { expect } from 'chai';

describe('PUSH_CHANNELS.search', () => {
  it('Should fetch channels based on the filter', async () => {
    const res = await search({
      filter: 80002,
      env: ENV.DEV,
      query: "Node"
    });
    console.log(res);
  });

  it('Should fetch channels based on the filter in new format', async () => {
    const res = await search({
      filter: 80002,
      env: ENV.DEV,
      query: "Node",
      oldFormat: false
    });
    console.log(res);
  });

  it('Should fetch channels based on the filter in new format', async () => {
    const res = await search({
      env: ENV.DEV,
      query: "a",
      oldFormat: false,
      tag: "Infrastructure"
    });
    console.log(res);
  });
});
