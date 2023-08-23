export class PushAPI {
  userAlice: any;

  static initialize(): PushAPI {
    console.log('Initializing PushAPI...');
    // Logic for initialization here
    return new PushAPI();
  }

  constructor() {
    // constructor logic here if needed
  }

  profile = {
    update: (): void => {
      console.log('Updating profile...');
      // Logic for profile update
    },
  };

  chat = {
    list: (): void => {
      console.log('Listing chats...');
      // Logic for chat list
    },

    latest: (): void => {
      console.log('Fetching latest chat...');
      // Logic for getting latest chat
    },

    history: (): void => {
      console.log('Fetching chat history...');
      // Logic for chat history
    },

    send: (): void => {
      console.log('Sending chat message...');
      // Logic to send a message
    },

    permissions: (): void => {
      console.log('Fetching chat permissions...');
      // Logic for chat permissions
    },

    info: (): void => {
      console.log('Fetching chat info...');
      // Logic for chat info
    },

    group: {
      permissions: (): void => {
        console.log('Fetching group permissions...');
        // Alias for chat permissions
      },

      info: (): void => {
        console.log('Fetching group info...');
        // Alias for chat info
      },

      create: (): void => {
        console.log('Creating chat group...');
        // Logic for creating a group
      },

      update: (): void => {
        console.log('Updating chat group...');
        // Logic for updating a group
      },

      manage: (): void => {
        console.log('Managing/Adjusting chat group...');
        // Alias for adjust (you can also rename it to adjust if preferred)
      },
    },

    decrypt: {
      messages: (): void => {
        console.log('Decrypting chat messages...');
        // Logic for decrypting messages
      },
    },
  };
}

// Usage example:

const userAlice = PushAPI.initialize();
userAlice.profile.update();
userAlice.chat.list();
// ... and so on for other methods
