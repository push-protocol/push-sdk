import React, { useContext, useEffect } from 'react';
import { useSpaceData } from '../../context';

export interface SpaceTrendingListProps {
  // Add props specific to the SpaceTrendingList component
  temporary?: string; // just to remove eslint error of empty prop
}

const SpaceTrendingList: React.FC<SpaceTrendingListProps> = () => {
  const { trendingListData, setTrendingListData } = useSpaceData();

  useEffect(() => {
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

    // Fetch trending list data if it's not already available
    if (!trendingListData) {
      fetchTrendingListData();
    }

    // Set up a timer to fetch updated data every 2 minutes
    const timer = setInterval(fetchTrendingListData, 2 * 60 * 1000);

    // Clean up the timer on component unmount
    return () => clearInterval(timer);
  }, [trendingListData, setTrendingListData]);

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

export default SpaceTrendingList;
