import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

export const CustomButton = ({title, onPress}: CustomButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    fontSize: 32,
    margin: 10,
    backgroundColor: '#D53A94',
    borderRadius: 10,
    width: '50%',
  },
  text: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});
