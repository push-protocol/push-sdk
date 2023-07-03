import React, { useEffect, useRef } from 'react';
import { pollAPI } from '../../../helpers';
import { useSpaceData } from '../../../hooks';

export interface ISpaceTrendingListProps {
  // Add props specific to the SpaceTrendingList component
  temporary?: string; // just to remove eslint error of empty prop
}

const TRENDING_LIST_POLLING_INTERVAL = 2 * 60 * 1000; // 2 minutes

export const SpaceTrendingList: React.FC<ISpaceTrendingListProps> = () => {
  const { trendingListData, setTrendingListData } = useSpaceData();
  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>();

  // Simulating an API call to fetch trending list data
  const fetchTrendingListData = async () => {
    try {
      // Make an API call to fetch the trending list data
      // const response = await 
      // const data = ;

      // Update the trending list data in the context
      // setTrendingListData(data);
    } catch (error) {
      console.error('Error fetching trending list data:', error);
    }
  };

  const startPolling = async () => {
    await pollAPI(fetchTrendingListData, TRENDING_LIST_POLLING_INTERVAL);
    // Schedule the next polling iteration
    timeoutIdRef.current = setTimeout(startPolling, TRENDING_LIST_POLLING_INTERVAL);
  };

  useEffect(() => {
    startPolling();

    // Clean up the poller on component unmount
    return () => {
      // Clear the timeout
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  return (
    <div>
      {/* Render the trending list data */}
      <ul>
        {trendingListData &&
          trendingListData.map((item: any) => (
            <li key={item.id}>{item.title}</li>
          ))}
      </ul>
    </div>
  );
};
