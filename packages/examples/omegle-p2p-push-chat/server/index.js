const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let users = [];

io.on("connection", (socket) => {
  console.log(`User connected with socket id: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected with socket id: ${socket.id}`);

    const id = socket.id;
    if (id) {
      const userIndex = users.findIndex((user) => user.id === id);

      // Check if the user is found
      if (userIndex !== -1) {
        const disconnectedUser = users[userIndex];
        users.splice(userIndex, 1);

        console.log("Updated Users Array:", users);

        // Emit "peer_disconnected" only to the connected peer
        const connectedPeerSocket = io.sockets.sockets.get(
          disconnectedUser.connectedPeerId
        );
        if (connectedPeerSocket) {
          connectedPeerSocket.emit("peer_disconnected");
        }
        // Update the connected peer's properties
        const connectedPeerIndex = users.findIndex(
          (user) => user.id === disconnectedUser.connectedPeerId
        );
        if (connectedPeerIndex !== -1) {
          users[connectedPeerIndex].busy = false;
          users[connectedPeerIndex].lookingForPeers = true;
        }
      }
    }
  });

  socket.on("connect_wallet", (walletAddress) => {
    // Store the wallet address and mark the user as connected
    console.log(`User connected with wallet address: ${walletAddress}`);
    socket.walletAddress = walletAddress;
    users.push({
      walletAddress: walletAddress,
      id: socket.id,
      online: true,
      busy: false,
      lookingForPeers: true,
      connectedPeerId: null, // Add a property to store connected peer's ID
    });
  });

  // Inside the "connect_to_peer" event handler
  socket.on("connect_to_peer", (walletAddress) => {
    // Check if the current peer is busy
    const caller = users.find((user) => user.walletAddress === walletAddress);
    if (caller && caller.busy) {
      return;
    }

    const availableUsers = users.filter(
      (user) =>
        user.walletAddress !== walletAddress &&
        user.online === true &&
        user.lookingForPeers === true &&
        user.busy === false
    );
    console.log(availableUsers);
    // Check if there are valid users in the filtered array
    if (availableUsers.length > 0) {
      // Choose a random item from the filtered array
      const chosenItem =
        availableUsers[Math.floor(Math.random() * availableUsers.length)];

      // Now you can use the chosenItem for further processing
      console.log(chosenItem);
      // Notify both peers that they are connected
      io.to(chosenItem.id).emit("peer_connected", walletAddress);
      io.to(caller.id).emit("peer_connected", chosenItem.walletAddress);
      const userIndexCaller = users.findIndex(
        (user) => user.walletAddress === walletAddress
      );
      const userIndexPeer = users.findIndex(
        (user) => user.walletAddress === chosenItem.walletAddress
      );
      users[userIndexCaller].busy = true;
      users[userIndexPeer].busy = true;
      users[userIndexCaller].lookingForPeers = false;
      users[userIndexPeer].lookingForPeers = false;
      users[userIndexCaller].connectedPeerId = chosenItem.id;
      users[userIndexPeer].connectedPeerId = caller.id;
    } else {
      io.to(caller.id).emit("no_active_peers_found", walletAddress);

      console.log("No valid user found.");
    }
  });

  socket.on("disconnect_peer", () => {
    // Handle disconnecting from a peer, if needed

    const walletAddress = socket.walletAddress;
    if (walletAddress) {
      const userIndex = users.findIndex(
        (user) => user.walletAddress === walletAddress
      );

      // Check if the user is found
      if (userIndex !== -1) {
        users.splice(userIndex, 1);

        console.log("Updated Users Array:", users);
      }
    }
  });

  // Other event handlers...
});
// Function to log users every 10 seconds
function logUsers() {
  console.log("-------------------Connected Users:--------------------------");
  users.forEach((user) => {
    console.log(
      `Wallet Address: ${user.walletAddress}, Online: ${user.online}, Busy: ${user.busy}, LookingForPeer: ${user.lookingForPeers} socket: ${user.id}`
    );
  });
  console.log("-------------------Connected Users:--------------------------");
}

// Schedule the logUsers function to run every 10 seconds
setInterval(logUsers, 10000); // 10000 milliseconds = 10 seconds

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
