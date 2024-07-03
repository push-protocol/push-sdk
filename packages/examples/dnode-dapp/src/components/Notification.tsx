import React, { useState } from 'react';

const SendNotification: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [notificationType, setNotificationType] = useState<string>('broadcast');
  const [recipient, setRecipient] = useState<string | string[]>([]); // State for recipients

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  };

  const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChannel(event.target.value);
  };

  const handleNotificationTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setNotificationType(value);
    // Reset recipient field when changing notification type
    setRecipient(value === 'broadcast' ? '' : []);
  };

  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    // If subset, convert to array of recipients split by comma
    setRecipient(value.split(',').map((email) => email.trim()));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    // Reset form fields if needed
    setTitle('');
    setBody('');
    setChannel('');
    setNotificationType('broadcast');
    setRecipient('');
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

        <div className="grid grid-cols-1 gap-y-6">
          <div>
            <label
              htmlFor="channel"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Channel
            </label>
            <select
              id="channel"
              name="channel"
              value={channel}
              onChange={handleChannelChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="channel1">Channel 1</option>
              <option value="channel2">Channel 2</option>
              <option value="channel3">Channel 3</option>
            </select>
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
              <option value="subset">Subset</option>
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
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};

export default SendNotification;
