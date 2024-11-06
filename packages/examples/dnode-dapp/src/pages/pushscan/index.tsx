// pages/explorer.tsx

import { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getRecentTransactionAccounts } from '../../utils/push';
import { formatDate, getCheckSumAddress } from '../../utils';

import dynamic from 'next/dynamic';

const GridLoader = dynamic(() => import('../../components/Loader'), {
  ssr: false,
});

export default function Explorer() {
  const [page, setPage] = useState(1);
  const [latestNotifications, setLatestNotifications] = useState<
    { nsId: string; last_usage: string }[]
  >([]);
  const [total, setTotal] = useState(20);
  const size = 10; // Hardcoded in api

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const router = useRouter();

  const handleClick = (address: string) => {
    router.push(`/pushscan/${getCheckSumAddress(address)}`);
  };

  useEffect(() => {
    // Fetch initial stats and latest blocks
    const fetchData = async () => {
      const recipients = await getRecentTransactionAccounts();
      setLatestNotifications(recipients);
    };

    // Polling function
    const intervalId = setInterval(fetchData, 30000); // 30000 ms = 30 seconds

    // Fetch data immediately on component mount
    fetchData();

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4 mx-5 md:mx-10 lg:mx-20 mb-10">
      {/* Header with Search Bar */}
      <header className="flex justify-center items-center text-center mb-4">
        <SearchBar />
      </header>

      <h3 className="text-lg font-semibold text-gray-900 my-10">
        Latest Transaction Recipients
      </h3>

      {latestNotifications.length > 0 ? (
        <ul role="list" className="divide-y divide-gray-100">
          {latestNotifications.map((notification, index) => (
            <Link href={`/pushscan/${notification.nsId}`} key={index}>
              <li className="flex justify-between gap-x-6 py-5 px-4 border border-gray-200 rounded-lg hover:scale-105 transition-transform duration-150 hover:cursor-pointer">
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-md bg-gray-50"
                    src="/user.png"
                    alt={`${notification.nsId} img`}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900 break-words overflow-x-auto">
                      {notification.nsId}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    {formatDate(notification.last_usage)}
                  </p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <GridLoader />
      )}

      <div className="mt-6 flex justify-end space-x-4">
        {/* {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300"
          >
            Previous Page
          </button>
        )} */}
        {/* {page * size < total && (
          <button
            onClick={handleNextPage}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Next Page
          </button>
        )} */}
      </div>
    </div>
  );
}
