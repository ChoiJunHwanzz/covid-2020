import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import LanBox from './mainlanbox';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

// 기본적인 언어들로 배경 색을 저장하고 개발하다가 추가로 데이터 추가 가능
const lans = [
  { name: 'english', id: 1, bcolors: { backgroundColor: '#CC97F3' } },
  { name: 'chinese', id: 2, bcolors: { backgroundColor: '#FDE27F' } },
  { name: 'japanese', id: 3, bcolors: { backgroundColor: '#7EA3ED' } },
  { name: 'korean', id: 4, bcolors: { backgroundColor: _getrandcolr() } },
  { name: 'additional', id: 5, bcolors: { backgroundColor: _getrandcolr() } },
];

export default class App extends Component {
  render() {
    return (
      <View style={styles.main}>
        <View style={styles.name}>
          <Text>Vocabulary App</Text>
        </View>
        <View style={styles.langs}>
          {lans.map((item) => (
            <LanBox name={item.name} bcolor={item.bcolors} key={item.id} />
          ))}
          <View style={styles.testbtn}>
            <Text>Test</Text>
          </View>
        </View>
      </View>
    );
  }
}

// 버튼 색 결정하기 위해 임의의 색 가져옴(실제로는 직접 색을 지정해줄 것임)
_getrandcolr = () => {
  let R = Math.round(Math.random() * 256);
  let G = Math.round(Math.random() * 256);
  let B = Math.round(Math.random() * 256);
  return `rgb(${R}, ${G}, ${B})`;
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#E57C76',
  },
  name: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langs: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testbtn: {
    width: (pwidth / 3) * 2 + 40,
    height: 100,
    borderRadius: 20,
    margin: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
