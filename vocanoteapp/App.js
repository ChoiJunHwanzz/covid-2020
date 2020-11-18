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
  FlatList,
} from 'react-native';
import LanBox from './mainlanbox';
import Showdatas from './showdatas';
import RBSheet from 'react-native-raw-bottom-sheet';
import lanjson from './lansjson';
import lans from './lans';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

// 버튼 색 결정하기 위해 임의의 색 가져옴(실제로는 직접 색을 지정해줄 것임)
_getrandcolr = () => {
  let R = Math.round(Math.random() * 256);
  let G = Math.round(Math.random() * 256);
  let B = Math.round(Math.random() * 256);
  return `rgb(${R}, ${G}, ${B})`;
};

export default class App extends Component {
  state = {
    isclicked: false,
    clickedbtn: null,
    item: {
      name: '영어',
      id: 1,
      bcolors: {backgroundColor: '#CC97F3'},
      data: ['sufficient'],
    },
  };
  _clickbtn = (item) => {
    if (item.name != 'add') {
      this.setState({
        isclicked: true,
        clickedbtn: item,
      });
    } else {
      this.RBSheet.open();
    }
  };
  render() {
    const {isclicked, clickedbtn, item} = this.state;
    return isclicked ? (
      <Showdatas item={clickedbtn} />
    ) : (
      // <Showdatas item={clickedbtn} />
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
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={pheight * 0.6}
          openDuration={250}
          customStyles={{
            container: {
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: pheight / 2,
            },
          }}
          closeOnDragDown={true}
          dragFromTopOnly={true}>
          <View
            style={{
              flex: 1,
              width: pwidth,
              backgroundColor: '#a1a1a1',
            }}>
            <ScrollView>
              {lanjson.map((lang, i) => (
                <TouchableOpacity
                  style={{height: 50, width: pwidth, borderWidth: 1}}
                  key={i}>
                  <View style={{height: 20, width: pwidth}}>
                    <Text>{lang.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </RBSheet>
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
