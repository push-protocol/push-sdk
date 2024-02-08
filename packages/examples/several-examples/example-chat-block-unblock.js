import { CONSTANTS, PushAPI } from '@pushprotocol/restapi';
import { ethers } from 'ethers';
import input from 'input';

console.log("Hello... what's my purpose?")
console.log("To train all the hackers..")

// Creating a random signer from a wallet, ideally this is the wallet you will connect
const aliceSigner = ethers.Wallet.createRandom();
const bobSigner = ethers.Wallet.createRandom();

console.log(`Signer address: ${aliceSigner.address} | Signer private key: ${aliceSigner.privateKey}`);
console.log(`Signer2 address: ${bobSigner.address} | Signer private key: ${bobSigner.privateKey}`);

// Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
const userAlice = await PushAPI.initialize(aliceSigner, { env: 'staging' });
const userBob = await PushAPI.initialize(bobSigner, { env: 'staging' });

const aliceAccount = aliceSigner.address;
const bobAccount = bobSigner.address;

// alice sends message as request to bob
console.log("Alice sends message as request to bob")
const aliceMessagesBob = await userAlice.chat.send(bobAccount, {
  type: "Text",
  content: "Hello Bob!",
});

console.log("Alice message bob", aliceMessagesBob)

const aliceMessagesBob2 = await userAlice.chat.send(bobAccount, {
  type: "Text",
  content: "Please accept so I can spam you with messages!",
});

console.log("Alice message bob again", aliceMessagesBob2)

// bob blocks alice
console.log("Bob blocks alice")
const blockAlice = await userBob.chat.block([aliceAccount]);
console.log("Bob blocks alice response", blockAlice)

try {
  const aliceMessagesBob3 = await userAlice.chat.send(bobAccount, {
    type: "Text",
    content: "YOU ARE NOT LISTENING TO ME!",
  });
  console.log("Alice message bob when bob has blocked part 1", aliceMessagesBob3)
  
}
catch (e) {
  console.log("Alice message bob when bob has blocked part 1", e)
}

try {
  const aliceMessagesBob4 = await userAlice.chat.send(bobAccount, {
    type: "Text",
    content: "HELLO I AM TALKNG TO YOU!",
  });
  
  console.log("Alice message bob when bob has blocked part 2", aliceMessagesBob4)
}
catch (e) {
  console.log("Alice message bob when bob has blocked part 2", e)
}

console.log("Bob unblocks alice")
const unblockAlice = await userBob.chat.unblock([aliceAccount]);
console.log("Bob unblocks alice response", unblockAlice)

const aliceMessagesBob5 = await userAlice.chat.send(bobAccount, {
  type: "Text",
  content: "I promise to be nice!",
});

console.log("Alice message bob when bob has unblocked", aliceMessagesBob5)

// bob accepts alice's message
console.log("Bob accepts alice's message")
const bobAcceptsAlice = await userBob.chat.accept(aliceAccount);
console.log("Bob accepts alice's message response", bobAcceptsAlice)

const aliceMessagesBob6 = await userAlice.chat.send(bobAccount, {
  type: "Text",
  content: "Finally you are talking! you scum",
});

console.log("Alice message bob when bob has accepted and is unblocked", aliceMessagesBob5)

// bob blocks alice again
console.log("Bob blocks alice again")
const blockAlice2 = await userBob.chat.block([aliceAccount]);
console.log("Bob blocks alice response", blockAlice2)

try {
  const aliceMessagesBob7 = await userAlice.chat.send(bobAccount, {
    type: "Text",
    content: "YOU SCUM! I WILL KEEP MESSAGING YOU!",
  });
  console.log("Alice message bob when bob has blocked part 3", aliceMessagesBob7)
  
}
catch (e) {
  console.log("Alice message bob when bob has blocked part 3", e)
}

try {
  const bobMessageAliceWhileBobBlockedAlice = await userAlice.chat.send(aliceAccount, {
    type: "Text",
    content: "Hehe, you are blocked",
  });
  
  console.log("Bob message alice when bob has blocked Alice", aliceMessagesBob8)
}
catch (e) {
  console.log("Bob message alice when bob has blocked Alice", e)
}

try {
  const aliceMessagesBob8 = await userAlice.chat.send(bobAccount, {
    type: "Text",
    content: "Okay okay I will stop! I promise!",
  });
  
  console.log("Alice message bob when bob has blocked part 4", aliceMessagesBob8)
}
catch (e) {
  console.log("Alice message bob when bob has blocked part 4", e)
}

console.log("Bob unblocks alice again")
const unblockAlice2 = await userBob.chat.unblock([aliceAccount]);
console.log("Bob unblocks alice response", unblockAlice2)x

const aliceMessagesBob9 = await userAlice.chat.send(bobAccount, {
  type: "Text",
  content: "I love you! I promise to be nice!",
});

console.log("Alice message bob when bob has accepted and is unblocked", aliceMessagesBob9)
