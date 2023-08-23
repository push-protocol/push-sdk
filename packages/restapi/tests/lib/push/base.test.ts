import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PushAPI } from '../../../src/lib/PushAPI'; // Ensure correct import path
import { expect } from 'chai';

describe.only('PushAPI class functionality', () => {
  let userAlice: PushAPI;

  beforeEach(() => {
    userAlice = PushAPI.initialize();
  });

  it('Should update user profile', () => {
    userAlice.profile.update();
    // Add your assertions here
    expect(true).to.be.true; // Replace with actual assertion
  });

  it('Should list chats', () => {
    userAlice.chat.list();
    // Add your assertions here
    expect(true).to.be.true; // Replace with actual assertion
  });

  // Similarly, write tests for other functions

  it('Should fetch latest chat', () => {
    userAlice.chat.latest();
    // Add your assertions here
    expect(true).to.be.true; // Replace with actual assertion
  });

  it('Should fetch chat history', () => {
    userAlice.chat.history();
    // Add your assertions here
    expect(true).to.be.true; // Replace with actual assertion
  });

  //... continue for other methods
});
