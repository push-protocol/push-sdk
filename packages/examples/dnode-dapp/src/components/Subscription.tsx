import React, { useState } from 'react';
import { changeSubscription } from '../utils/push';
import { useWalletClient } from 'wagmi';

const SendSubscription: React.FC = () => {
  const [channel, setChannel] = useState<string>('');
  const [action, setAction] = useState<string>('Subscribe');
  const [errorMessage, setErrorMessage] = useState<string>(''); // State for error message
  const [sending, setSending] = useState<boolean>(false);

  const walletClient = useWalletClient();

  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Sending event:', channel, action);

    setSending(true);
    try {
      const res = await changeSubscription(
        channel,
        action as 'Subscribe' | 'Unsubscribe',
        walletClient.data
      );
      console.log(res);
      if ((res as { status: string }).status === '') {
        setErrorMessage(res.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        (error as any).message ||
          'An error occurred while sending subscription request. Please try again.'
      );
    }
    setChannel('');
    setSending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-full"
    >
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Subscribe / Unsubscribe to Channel
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Push (EPNS) makes it extremely easy to open and maintain a genuine
            channel of communication with your users.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-6">
          <div>
            <label
              htmlFor="channel"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Channel
            </label>
            <input
              id="channel"
              name="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></input>
          </div>

          <div>
            <label
              htmlFor="action"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Action
            </label>
            <select
              id="action"
              name="action"
              value={action}
              onChange={handleActionChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Subscribe">Subscribe</option>
              <option value="Unsubscribe">Unsubscribe</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={walletClient.data === undefined || sending}
            className={`px-4 py-2 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 ${
              !sending && walletClient.data
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SendSubscription;
