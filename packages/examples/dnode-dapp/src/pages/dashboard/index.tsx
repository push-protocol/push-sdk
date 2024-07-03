import Head from 'next/head';
import React from 'react';
import SendNotification from '../../components/Notification';

const Dashboard: React.FC = () => {
  return (
    <div className="p-20">
      <SendNotification />
    </div>
  );
};

export default Dashboard;
