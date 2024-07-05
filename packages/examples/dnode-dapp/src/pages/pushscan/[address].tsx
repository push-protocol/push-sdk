// pages/pushscan/[term].tsx

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const PushScan: React.FC = () => {
  const router = useRouter();
  const { address } = router.query; // Extract the dynamic term from the URL
  const [data, setData] = useState<any>(null); // State to store fetched data or results

  //   useEffect(() => {
  //     if (term) {
  //       // Fetch data or perform actions based on the dynamic term
  //       const fetchData = async () => {
  //         // Replace this with your actual data fetching logic
  //         const response = await fetch(`/api/pushscan/${term}`);
  //         const result = await response.json();
  //         setData(result);
  //       };

  //       fetchData();
  //     }
  //   }, [term]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        PushScan Results for: {address}
      </h1>
    </div>
  );
};

export default PushScan;
