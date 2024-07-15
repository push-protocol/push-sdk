import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getAddressTrx } from '../../utils/push';
import SearchBar from '../../components/SearchBar';
import dynamic from 'next/dynamic';

const GridLoader = dynamic(() => import('../../components/Loader'), {
  ssr: false,
});

// Component to display the result data
const NodeResult: React.FC<{ result: any }> = ({ result }) => (
  <div className="border p-4 mb-4">
    <h2 className="text-xl font-semibold mb-2">Node Result</h2>
    <p>Transaction Count: {result.itemCount}</p>
    <p>Node Quorum Result: {result.quorumResult}</p>
    <p>Last Timestamp: {result.lastTs}</p>
    <p>Transactions Without Quorum Count: {result.keysWithoutQuorumCount}</p>
  </div>
);

// Component to display individual items (transactions)
const ParsedTransactionData: React.FC<{ item: any }> = ({ item }) => (
  <div className="border p-4 mb-4 bg-gray-100">
    <pre className="bg-gray-800 text-white p-4 rounded whitespace-pre-wrap break-words overflow-x-auto">
      {JSON.stringify(item, null, 2)}
    </pre>
  </div>
);

const PushScan: React.FC = () => {
  const router = useRouter();
  const { address } = router.query; // Extract the dynamic address from the URL
  const [afterEpoch, setAfterEpoch] = useState<number | undefined>(undefined);
  const [data, setData] = useState<any>(null); // State to store fetched data or results
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (address) {
      // Fetch data or perform actions based on the dynamic address
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await getAddressTrx(address as string, afterEpoch);
          setData(response);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [address, afterEpoch]);

  return (
    <div className="p-4 mx-5 md:mx-10 lg:mx-20 mb-10">
      {/* Header with Search Bar */}
      <header className="flex justify-center items-center text-center mb-4">
        <SearchBar />
      </header>
      <h1 className="text-lg mb-4 pt-10 pb-5 break-words overflow-x-auto">
        PushScan Results for: <span className="font-bold">{address}</span>
      </h1>
      {data && (
        <div>
          <NodeResult result={data.result} />
          {data.items.length > 0 ? (
            <h3 className="text-lg mb-4 pt-10 pb-0">Parsed Transaction Data</h3>
          ) : null}
          {data.items.map((item: any, index: number) => (
            <ParsedTransactionData key={index} item={item} />
          ))}
        </div>
      )}
      {loading && <GridLoader />}
      <button
        disabled={!data || data?.result.itemCount < 20}
        onClick={() => setAfterEpoch(parseFloat(data?.result.lastTs))}
        className={`px-4 py-2 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 ${
          !data || data?.result.itemCount < 20
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500'
        }`}
      >
        Next Transactions
      </button>
    </div>
  );
};

export default PushScan;
