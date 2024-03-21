import * as PushAPI from '@pushprotocol/restapi';
import { CONSTANTS } from '@pushprotocol/restapi';
import React, { useContext, useEffect, useState } from 'react';
import Loader from './components/Loader';
import {
  CodeFormatter,
  Section,
  SectionButton,
  SectionItem,
} from './components/StyledComponents';
import { EnvContext, Web3Context } from './context';

import { getCAIPAddress } from './helpers';

const ChannelsTest = () => {
  const { library, account, chainId } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);

  const [isLoading, setLoading] = useState(false);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sort, setSort] = useState<string>(CONSTANTS.FILTER.CHANNEL_LIST.SORT.SUBSCRIBER);
  const [order, setOrder] = useState<string>(CONSTANTS.FILTER.CHANNEL_LIST.ORDER.DESCENDING);

  const [channelListData, setChannelListData] = useState();

  const updatePage = (e: React.SyntheticEvent<HTMLElement>) => {
    setPage(parseInt((e.target as HTMLInputElement).value));
  };

  const updateLimit = (e: React.SyntheticEvent<HTMLElement>) => {
    setLimit(parseInt((e.target as HTMLInputElement).value));
  };

  const updateSort = (e: React.SyntheticEvent<HTMLElement>) => {
    setSort((e.target as HTMLInputElement).value);
  };

  const updateOrder = (e: React.SyntheticEvent<HTMLElement>) => {
    setOrder((e.target as HTMLInputElement).value);
  };

  const testGetChannelByAddress = async () => {
    try {
      setLoading(true);

      // object for channel data
      const response = await PushAPI.channels.getChannels({
        env: env,
        page: page, 
        limit: limit, 
        sort: sort,
        order: order,
      });

      setChannelListData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <h2>List Channels Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <div>
          <SectionItem style={{ marginTop: 20 }}>
            <label>Page</label>
            <input
              type="text"
              onChange={updatePage}
              value={page}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>
          <br />
          
          <SectionItem style={{ marginTop: 20 }}>
            <label>Limit</label>
            <input
              type="text"
              onChange={updateLimit}
              value={limit}
              style={{ width: 400, height: 30 }}
            />
          </SectionItem>

          <SectionItem style={{ marginTop: 20 }}>
            <label>Sort</label>
            <select
              onChange={updateSort}
              value={sort}
              style={{ width: 400, height: 30 }}
            >
              <option value={CONSTANTS.FILTER.CHANNEL_LIST.SORT.SUBSCRIBER}>Subscriber</option>
              {/* Add other sort options here */}
            </select>
          </SectionItem>

          <SectionItem style={{ marginTop: 20 }}>
            <label>Order</label>
            <select
              onChange={updateOrder}
              value={order}
              style={{ width: 400, height: 30 }}
            >
              <option value={CONSTANTS.FILTER.CHANNEL_LIST.ORDER.DESCENDING}>Descending</option>
              <option value={CONSTANTS.FILTER.CHANNEL_LIST.ORDER.ASCENDING}>Ascending</option>
              {/* Add other order options here if any */}
            </select>
          </SectionItem>

          <div style={{ marginTop: 20, paddingTop: 20 }}>
            <SectionButton onClick={testGetChannelByAddress}>
              Get Channels List
            </SectionButton>
          </div>
        </div>

        <div style={{ marginTop: 50, paddingTop: 30, borderTop: '1px solid' }}>
          {channelListData ? (
            <CodeFormatter>
              {JSON.stringify(channelListData, null, 4)}
            </CodeFormatter>
          ) : null}
        </div>
      </Section>
    </div>
  );
};

export default ChannelsTest;
