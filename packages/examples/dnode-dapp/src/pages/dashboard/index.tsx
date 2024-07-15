import React, { useState } from 'react';
import SendNotification from '../../components/Notification';
import SendSubscription from '../../components/Subscription';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notification' | 'subscription'>(
    'notification'
  );

  return (
    <div className="p-5 md:p-10">
      <div className="border-b border-gray-200">
        <nav className="flex justify-center space-x-4" aria-label="Tabs">
          <button
            className={`py-4 px-6 text-sm font-medium text-center whitespace-nowrap ${
              activeTab === 'notification'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('notification')}
          >
            Notification
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium text-center whitespace-nowrap ${
              activeTab === 'subscription'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('subscription')}
          >
            Subscription
          </button>
        </nav>
      </div>

      <div className="mt-10">
        {activeTab === 'notification' && (
          <div>
            <SendNotification />
          </div>
        )}
        {activeTab === 'subscription' && (
          <div>
            <SendSubscription />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
