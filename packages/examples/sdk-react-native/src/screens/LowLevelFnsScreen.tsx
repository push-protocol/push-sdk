import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {CustomButton} from '../components';
import {
  handleApproveRequest,
  handleConversationHash,
  handleCreateGroup,
  handleEthers,
  handleGetUser,
  handleInbox,
  handleLatestMsg,
  handlePgp,
  handleProfileUpdate,
  handleProfileUpgrade,
  handleSend,
  handleUpdateGroup,
  handleUserCreate,
} from '../helpers';

export const LowLevelFnsScreen = () => {
  return (
    <ScrollView style={styles.container} overScrollMode="never">
      <CustomButton title="Inbox" onPress={handleInbox} />
      <CustomButton title="New User" onPress={handleUserCreate} />
      <CustomButton title="Generate PGP Pair" onPress={handlePgp} />
      <CustomButton title="Log Address" onPress={handleEthers} />
      <CustomButton title="Create Group" onPress={handleCreateGroup} />
      <CustomButton title="Update group" onPress={handleUpdateGroup} />
      <CustomButton title="ConversationHash" onPress={handleConversationHash} />
      <CustomButton title="Get user" onPress={handleGetUser} />
      <CustomButton title="Update Profile" onPress={handleProfileUpdate} />
      <CustomButton title="Upgrade Profile" onPress={handleProfileUpgrade} />
      <CustomButton title="Send Message" onPress={handleSend} />
      <CustomButton title="Approve Request" onPress={handleApproveRequest} />
      <CustomButton title="Latest Message" onPress={handleLatestMsg} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
