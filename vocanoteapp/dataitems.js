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
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const pwidth = Dimensions.get('window').width;

export default class DataItem extends Component {
  state = {
    item: this.props.item,
  };

  _donedata = () => {
    this.setState({
      item: {
        ...this.state.item,
        Done: !this.state.item.Done,
      },
    });
  };

  render() {
    const {item} = this.state;
    return (
      <View
        style={
          item.Done
            ? {
                ...styles.datas,
                backgroundColor: 'rgba(242,149,95,0.8)',
                opacity: 0.8,
              }
            : {...styles.datas, backgroundColor: this.props.color}
        }>
        <View style={styles.datadetails}>
          <TouchableOpacity style={styles.checkboxbtn} onPress={this._donedata}>
            <EntypoIcon
              name="check"
              style={
                item.Done
                  ? {...styles.checkbox, color: '#f1f1f1'}
                  : styles.checkbox
              }></EntypoIcon>
          </TouchableOpacity>
          <View style={styles.words}>
            <Text
              style={
                item.Done ? {...styles.word, color: '#f1f1f1'} : styles.word
              }>
              {item.word}
            </Text>
            <Text
              style={
                item.Done
                  ? {...styles.translated, color: '#f1f1f1'}
                  : styles.translated
              }>
              {item.translated}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  datas: {
    width: pwidth * 0.8,
    height: 80,
    backgroundColor: 'rgba(242,149,95,1)',
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 25,
    padding: 5,
  },
  datadetails: {
    height: 70,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  checkboxbtn: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    color: 'rgba(255,255,255,1)',
    fontSize: 40,
  },
  words: {
    width: pwidth * 0.8 - 60,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
  },
  word: {
    left: 10,
    color: '#121212',
    fontSize: 25,
  },
  translated: {
    position: 'absolute',
    right: 10,
    color: '#121212',
    fontSize: 25,
  },
});
