import React, { useEffect, useState } from 'react';
import { getChannelInfo, sendNotification } from '../utils/push';
import { useAccount, useWalletClient } from 'wagmi';

const SendNotification: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [notificationType, setNotificationType] = useState<string>('broadcast');
  const [recipient, setRecipient] = useState<string[]>(['*']); // State for recipients
  const [allowNotification, setAllowNotification] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(''); // State for error message
  const [sending, setSending] = useState<boolean>(false);

  const { isConnected } = useAccount();
  const walletClient = useWalletClient();

  useEffect(() => {
    const checkNotificationPermission = async () => {
      if (isConnected && walletClient.data && channel === '') {
        try {
          const channelInfo = await getChannelInfo(walletClient.data);
          if (channelInfo !== null) {
            setAllowNotification(true);
            setChannel(channelInfo.channel);
            setErrorMessage(''); // Clear error message if the channel is found
          } else {
            setAllowNotification(false);
            setErrorMessage('Channel not found. Please check your settings.'); // Set error message
          }
        } catch (error) {
          setAllowNotification(false);
          setErrorMessage('Error fetching channel info.'); // Set error message
        }
      }
    };
    checkNotificationPermission();
  }, [walletClient]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  // const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setChannel(event.target.value);
  // };

  const handleNotificationTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setNotificationType(value);
    // Reset recipient field when changing notification type
    setRecipient(value === 'broadcast' ? ['*'] : []);
  };

  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    // If subset, convert to array of recipients split by comma
    setRecipient(value.split(',').map((email) => email.trim()));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your notification sending logic here
    console.log(
      'Notification sent:',
      title,
      body,
      channel,
      notificationType,
      recipient
    );

    setAllowNotification(false);
    setSending(true);
    try {
      const res = await sendNotification(
        title,
        body,
        recipient,
        walletClient.data
      );
      setAllowNotification(false);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
    // Reset form fields if needed
    setTitle('');
    setBody('');
    setChannel('');
    setNotificationType('broadcast');
    setRecipient(['*']);
    setSending(false);
    setAllowNotification(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-full"
    >
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Send Notification
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
              disabled={true}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></input>
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              autoComplete="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your Notification Title"
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Body
            </label>
            <textarea
              id="body"
              name="body"
              rows={3}
              value={body}
              onChange={handleBodyChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Your Notification Body"
            />
          </div>
          <div>
            <label
              htmlFor="notificationType"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Notification Type
            </label>
            <select
              id="notificationType"
              name="notificationType"
              value={notificationType}
              onChange={handleNotificationTypeChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="broadcast">Broadcast</option>
              <option value="targeted">Targeted</option>
              {/* <option value="subset">Subset</option> */}
            </select>
          </div>

          {notificationType !== 'broadcast' && (
            <div>
              <label
                htmlFor="recipient"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Recipient(s)
              </label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={
                  Array.isArray(recipient) ? recipient.join(', ') : recipient
                }
                onChange={handleRecipientChange}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  notificationType === 'targeted'
                    ? 'Enter recipient address'
                    : 'Enter comma-separated recipient addresses'
                }
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={!allowNotification}
            className={`px-4 py-2 font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 ${
              allowNotification
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

export default SendNotification;
