import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { GLOBALS } from '../../constants';

export type DecryptButtonProps = {
  decryptFn: () => Promise<unknown>;
  isSecretRevealed: boolean;
};

const buttonText = {
  revealed: 'decrypted',
  notRevealed: 'decrypt',
};

const DecryptButton: React.FC<DecryptButtonProps> = ({
  decryptFn,
  isSecretRevealed,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const btnText = isSecretRevealed
    ? buttonText.revealed
    : buttonText.notRevealed;

  const onPress = async () => {
    if (!decryptFn || isSecretRevealed) return;

    try {
      setIsLoading(true);
      await decryptFn();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      disabled={isSecretRevealed}
      onPress={onPress}
      style={styles.button}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={GLOBALS.COLORS.WHITE} />
      ) : (
        <Text style={styles.buttonText}>{btnText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default DecryptButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#674C9F',
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: GLOBALS.COLORS.WHITE,
    fontSize: 12,
  },
});
