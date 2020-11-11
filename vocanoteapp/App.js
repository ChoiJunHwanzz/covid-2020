import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LanBox from './mainlanbox';
import Showdatas from './showdatas';

const pwidth = Dimensions.get('window').width;

// 버튼 색 결정하기 위해 임의의 색 가져옴(실제로는 직접 색을 지정해줄 것임)
_getrandcolr = () => {
  let R = Math.round(Math.random() * 256);
  let G = Math.round(Math.random() * 256);
  let B = Math.round(Math.random() * 256);
  return `rgb(${R}, ${G}, ${B})`;
};

// 기본적인 언어들로 배경 색을 저장하고 개발하다가 추가로 데이터 추가 가능
const lans = [
  {
    name: '영어',
    id: 1,
    bcolors: {backgroundColor: '#CC97F3'},
    data: ['hi'],
  },
  {
    name: '중국어',
    id: 2,
    bcolors: {backgroundColor: '#FDE27F'},
    data: ['你好'],
  },
  {
    name: '일본어',
    id: 3,
    bcolors: {backgroundColor: '#7EA3ED'},
    data: ['こんにちは'],
  },
  {name: 'add', id: 5, bcolors: {backgroundColor: '#37B092'}},
];

export default class App extends Component {
  state = {
    isclicked: false,
    clickedbtn: null,
  };
  _clickbtn = (item) => {
    if (item.name != 'add') {
      this.setState({
        isclicked: true,
        clickedbtn: item,
      });
    }
  };
  render() {
    const {isclicked, clickedbtn} = this.state;
    return isclicked ? (
      <Showdatas item={clickedbtn} />
    ) : (
      <View style={styles.main}>
        <View style={styles.name}>
          <Text style={styles.nametxt}>Vocabulary App</Text>
        </View>
        <View style={styles.langs}>
          {lans.map((item) => (
            <TouchableOpacity
              onPress={this._clickbtn.bind(this, item)}
              key={item.id}>
              <LanBox item={item} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#E57C76',
  },
  name: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nametxt: {
    fontSize: 50,
    fontFamily: 'Itim-Regular',
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
