import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Dimensions } from 'react-native';

const pwidth = Dimensions.get('window').width;

export default class LanBox extends Component {
  render() {
    return (
      <View>
        <View style={[styles.lanbox, this.props.bcolor]}>
          <Text>{this.props.name}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  lanbox: {
    width: pwidth / 3,
    height: 100,
    borderRadius: 20,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
