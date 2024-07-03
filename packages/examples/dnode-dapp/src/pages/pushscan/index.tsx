// pages/explorer.tsx

import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import StatsComponent from '../../components/Stats';
import LatestBlocksComponent from '../../components/LatestBlock';
import { fetchNetworkStats, fetchLatestBlocks } from '../../utils'; // Example function to fetch data

export default function Explorer() {
  const [stats, setStats] = useState({});
  const [latestBlocks, setLatestBlocks] = useState([]);

  useEffect(() => {
    // Fetch initial stats and latest blocks
    const fetchData = async () => {
      const statsData = await fetchNetworkStats();
      const latestBlocksData = await fetchLatestBlocks(30);
      //   setStats(statsData);
      //   setLatestBlocks(latestBlocksData);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      {/* Header with Search Bar */}
      <header className="flex justify-center items-center text-center mb-4">
        <SearchBar />
      </header>

      {/* Stats Component */}
      {/* <StatsComponent totalBlocks={stats.totalBlocks} tps={stats.tps} /> */}

      {/* Latest Blocks Section */}
      {/* <LatestBlocksComponent blocks={latestBlocks} /> */}
    </div>
  );
}
