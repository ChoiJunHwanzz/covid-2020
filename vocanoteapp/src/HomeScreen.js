import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {WheelPicker} from 'react-native-wheel-picker-android';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import v4 from 'uuid/v4';
import SplashScreen from 'react-native-splash-screen';
import LanBox from './mainlanbox';
import lanjson from './defaultvalues/lansjson';
import lans from './defaultvalues/lans';
import colorselect from './defaultvalues/colors';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

export default class HomeScreen extends Component {
  state = {
    datas: null, // lan buttons
    isloaded: false,
    addlan: {name: '언어 추가'}, // selected addable lan
    landatas: [], // addable lans
    landatasname: [], //for android
    selectlan: '',
    colorselection: [], // for random color
    deleting: false,
    lanboxrefs: {},
    cansubmit: false, // make user submit only after language selected
    goTest: false,
    enablebtn: true,
  };

  backAction = () => {
    Alert.alert('종료', '정말로 종료하시겠습니까?', [
      {
        text: '취소',
        onPress: () => null,
        style: 'cancel',
      },
      {text: '확인', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this._getAddableDatas();
    this._getLanBoxDatas();
    this._getColors();
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  };

  _getAddableDatas = async () => {
    // to get addable languages list
    const addable = await AsyncStorage.getItem('addableLan');
    const parsedadd = JSON.parse(addable);
    if (parsedadd == null) {
      let arr = [];
      lanjson.forEach((lan) => {
        arr.push(lan.name);
      });
      this.setState({
        landatas: lanjson,
        landatasname: arr,
      });
    } else {
      let arr = [];
      parsedadd.forEach((lan) => {
        arr.push(lan.name);
      });
      this.setState({
        landatas: parsedadd,
        landatasname: arr,
      });
    }
  };

  _getLanBoxDatas = async () => {
    // to get using languages
    const asdatas = await AsyncStorage.getItem('vocaDatas');
    const parsed = JSON.parse(asdatas);
    if (parsed == null) {
      this.setState({
        datas: lans,
        isloaded: true,
      });
    } else {
      const filterdata = parsed.filter((data) => {
        return data.id !== 'add';
      });
      const final = JSON.stringify(filterdata);
      await AsyncStorage.setItem('vocaDatas', final);
      this.setState({
        datas: filterdata,
        isloaded: true,
      });
    }
  };

  _getColors = async () => {
    // to set colors for additional languages
    const colors = await AsyncStorage.getItem('colorSelection');
    const parsedcolors = JSON.parse(colors);
    if (parsedcolors != null) {
      let filterdata = [];
      parsedcolors.map((color) => {
        if (color.color !== '#ff7f7f') {
          filterdata.push(color);
        } else {
          filterdata.push({color: '#37B092'});
        }
      });
      const final = JSON.stringify(filterdata);
      await AsyncStorage.setItem('colorSelection', final);
      this.setState({
        colorselection: filterdata,
      });
    } else {
      const color = JSON.stringify(colorselect);
      await AsyncStorage.setItem('colorSelection', color);
      this.setState({
        colorselection: colorselect,
      });
    }
  };

  // decide lan button's backgroundcolor
  _getrandcolor = () => {
    const {colorselection} = this.state;
    const idx = Math.round(Math.random() * (colorselection.length - 1));

    const returnval = colorselection[idx].color;
    let colors = colorselection;
    colors.splice(idx, 1);
    this.setState(async (prev) => {
      const newstate = {
        ...prev,
        colorselection: colors,
      };

      const ASsavecolor = JSON.stringify(colors);
      await AsyncStorage.setItem('colorSelection', ASsavecolor);

      return newstate;
    });

    return returnval;
  };

  _clickLanBox = (item) => {
    const {goTest, lanboxrefs, enablebtn} = this.state;
    if (goTest) {
      Object.values(lanboxrefs).map((lanbox) => {
        lanbox.forceUpdate(() => {
          lanbox.setState({
            goTestPage: false,
          });
        });
      });
      this.setState(
        {
          goTest: false,
          enablebtn: !enablebtn,
        },
        async () => {
          const beforeparse = await AsyncStorage.getItem(item.code + '');
          const parsed = JSON.parse(beforeparse);
          if (parsed == null || Object.values(parsed).length === 0) {
            alert('단어가 존재하지 않습니다\n먼저 단어를 추가해주세요');
          } else {
            this.props.navigation.push('Testscreen', {
              info: item,
              datas: parsed,
            });
          }
        },
      );
    } else {
      this.props.navigation.push('Datas', {
        item: item,
      });
    }
  };

  _addselectbtn = async () => {
    const {datas, landatas, addlan} = this.state;
    let datasarr = datas;
    let newitem = {
      name: addlan.name,
      code: addlan.code,
      id: v4() + '',
      bcolors: {
        backgroundColor: this._getrandcolor(),
      },
    };
    let landatasarr = landatas;
    const idx = landatas.findIndex((item) => {
      return item.name == addlan.name;
    });
    landatasarr.splice(idx, 1);
    let lannamearr = [];
    landatasarr.forEach((lan) => {
      lannamearr.push(lan.name);
    });
    datasarr.push(newitem);

    const savedatas = JSON.stringify(datasarr);
    await AsyncStorage.setItem('vocaDatas', savedatas);
    const savelandatas = JSON.stringify(landatasarr);
    await AsyncStorage.setItem('addableLan', savelandatas);
    this.setState(
      {
        datas: datasarr,
        landatas: landatasarr,
        landatasname: lannamearr,
        addlan: {
          name: '언어 선택',
        },
        cansubmit: false,
      },
      () => {
        this.RBSheet.close();
      },
    );
  };

  // toggle delete button to delete certain box
  _toggleDeletebox = async () => {
    const {deleting, lanboxrefs} = this.state;
    if (deleting) {
      await this._getAddableDatas();
      await this._getLanBoxDatas();
      await this._getColors();
    }
    Object.values(lanboxrefs).map((lanbox) => {
      try {
        lanbox.forceUpdate(() => {
          lanbox.setState({
            isdeleting: !deleting,
          });
        });
      } catch {
        // 삭제 후 ref 관리,
        const idx = Object.values(lanboxrefs).findIndex((ref) => {
          return ref === lanbox;
        });
        const code = Object.keys(lanboxrefs)[idx];
        delete lanboxrefs[code];
      }
    });
    this.setState({
      deleting: !deleting,
    });
  };

  _gotoTestScreen = () => {
    const {lanboxrefs, goTest, enablebtn} = this.state;

    Object.values(lanboxrefs).map((lanbox) => {
      lanbox.forceUpdate(() => {
        lanbox.setState({
          goTestPage: !lanbox.state.goTestPage,
        });
      });
    });
    this.setState({
      goTest: !goTest,
      enablebtn: !enablebtn,
    });
  };

  _addlanbox = () => {
    this.RBSheet.open();
  };

  render() {
    const {
      datas,
      isloaded,
      landatas,
      landatasname,
      selectlan,
      addlan,
      deleting,
      cansubmit,
      enablebtn,
    } = this.state;
    return !isloaded ? ( // loading
      <View
        style={{
          backgroundColor: '#E57C76',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 30}}>loading</Text>
      </View>
    ) : (
      // main screen
      <View style={styles.main}>
        <SafeAreaView style={styles.name}>
          <Text style={styles.nametxt}>Vocabulary App</Text>
          <TouchableOpacity
            style={styles.editbtn}
            disabled={!enablebtn}
            onPress={this._toggleDeletebox}>
            {deleting ? (
              <MaterialIcons name={'check'} size={30} />
            ) : (
              <MaterialIcons name={'delete-outline'} size={30} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={landatas.length !== 0 ? styles.addbtn : {display: 'none'}}
            disabled={!enablebtn || deleting}
            onPress={this._addlanbox}>
            <MaterialIcons name={'add'} size={30} />
          </TouchableOpacity>
        </SafeAreaView>
        <ScrollView style={styles.langs}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {datas.map((item) => (
              <TouchableOpacity
                onPress={() => this._clickLanBox(item)}
                activeOpacity={Platform.OS == 'android' ? 0.9 : 0.5}
                disabled={deleting}
                key={item.id}>
                <LanBox
                  item={item}
                  ref={(ref) => {
                    let refs = this.state.lanboxrefs;
                    refs[item.code] = ref;
                  }}
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              disabled={deleting}
              activeOpacity={Platform.OS == 'android' ? 0.9 : 0.5}
              onPress={this._gotoTestScreen}>
              <View style={{...styles.testbox, backgroundColor: '#76C1E2'}}>
                <Text
                  style={{
                    fontSize: 30,
                    color: '#f1f1f1',
                    fontFamily: 'Bazzi',
                  }}>
                  시험 보기
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 바텀 시트 */}
        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          height={400}
          openDuration={250}
          customStyles={{
            container: {
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}
          closeOnDragDown={true}
          dragFromTopOnly={true}>
          <View
            style={{
              flex: 1,
              width: pwidth,
              backgroundColor: 'white',
              padding: 20,
              alignItems: 'center',
            }}>
            <View style={styles.addlanview}>
              <Text style={styles.addlantxt}>{addlan.name}</Text>
            </View>
            {Platform.OS == 'ios' ? (
              // for ios
              <Picker
                selectedValue={selectlan}
                style={{
                  width: pwidth - 40,
                }}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    addlan: landatas[itemIndex],
                    selectlan: itemValue,
                    cansubmit: true,
                  });
                }}>
                {landatas.map((lan, i) => (
                  <Picker.Item label={lan.name} value={lan.code} key={i} />
                ))}
              </Picker>
            ) : (
              // for android
              <WheelPicker
                data={landatasname}
                selectedItem={0}
                style={{
                  width: pwidth - 40,
                  height: 200,
                  marginTop: 20,
                }}
                itemTextSize={23}
                selectedItemTextSize={23}
                onItemSelected={(idx) => {
                  this.setState({
                    addlan: landatas[idx],
                    cansubmit: true,
                  });
                }}
              />
            )}
            <TouchableOpacity
              style={{
                borderRadius: 15,
                width: pwidth - 40,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#5DAD93',
              }}
              disabled={!cansubmit}
              onPress={() => this._addselectbtn()}>
              <Text
                style={{
                  fontFamily: 'Itim-Regular',
                  fontSize: 30,
                }}>
                Select
              </Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nametxt: {
    fontSize: 50,
    fontFamily: 'Itim-Regular',
  },
  addbtn: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 120,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editbtn: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 120,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langs: {
    flex: 1,
    width: pwidth,
    flexWrap: 'wrap',
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

  // test
  testbox: {
    width: pwidth * 0.8,
    margin: 10,
    height: 130,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#4d4d4d',
        shadowOffset: {
          width: 5,
          height: 7,
        },
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  //in bottomsheet(add languages)
  addlanview: {
    width: 110,
    height: 50,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addlantxt: {
    fontSize: 23,
  },
});
