import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Showdatas from './showdatas';

const pwidth = Dimensions.get('window').width;

export default class LanBox extends Component {
  render() {
    return this.props.item.name != 'add' ? (
      <View style={[styles.lanbox, this.props.item.bcolors]}>
        <Text style={styles.btnname}>{this.props.item.name}</Text>
      </View>
    ) : (
      // add는 따로 구현
      <View style={[styles.lanbox, this.props.item.bcolors]}>
        <Text style={styles.btnname}>{this.props.item.name}</Text>
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
