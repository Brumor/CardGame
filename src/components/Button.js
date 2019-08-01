import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import axios from 'axios';

const Button = ({ onPress, text }) => (
  <TouchableHighlight style={styles.button} onPress={onPress} underlayColor='#ddd'>
    <Text>
      {text}
    </Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    margin: 30,
    padding: 40,

    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
  },
});

export default Button;
