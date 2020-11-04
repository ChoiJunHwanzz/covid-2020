import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';

const pwidth = Dimensions.get('window').width;

export default class LanBox extends Component {
  render() {
    return this.props.name != 'add' ? (
      <View>
        <View style={[styles.lanbox, this.props.bcolor]}>
          <Text style={styles.btnname}>{this.props.name}</Text>
        </View>
      </View>
    ) : (
      // add는 따로 구현
      <View>
        <View style={[styles.lanbox, this.props.bcolor]}>
          <Text style={styles.btnname}>{this.props.name}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  lanbox: {
    width: pwidth * 0.4,
    height: 130,
    borderRadius: 20,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnname: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f1f1f1',
  },
});
