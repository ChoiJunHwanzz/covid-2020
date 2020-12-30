import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SwipeListView} from 'react-native-swipe-list-view';
import v4 from 'uuid/v4';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;
const API_KEY = 'a354f15846c295907ffa112868b14fcd';

export default class Showdatas extends Component {
  state = {
    txt: '', // before translated
    sectxt: '', // user input meaning
    name: this.props.route.params.item.name, // lan name
    code: this.props.route.params.item.code, // lan code
    color: this.props.route.params.item.bcolors.backgroundColor, // lan color
    modalvisible: false, // to show modal
    vocadatas: {}, // save voca datas
    togtr: false, // to toggle translate automatically
    toglan: false, // to toggle target language
  };
  componentDidMount = () => {
    this._getDatas();
  };

  _getDatas = async () => {
    const {code} = this.state;
    await AsyncStorage.getItem(code + '').then((vocas) => {
      const parsedvocas = JSON.parse(vocas);
      this.setState((prev) => {
        const news = {
          ...prev,
          vocadatas: parsedvocas || {},
        };
        return {...news};
      });
    });
  };

  _translateKakao = async () => {
    const {txt, code, toglan} = this.state;
    const option = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `KakaoAK ${API_KEY}`,
      },
    };
    if (toglan) {
      return fetch(
        `https://dapi.kakao.com/v2/translation/translate?query=${txt}&src_lang=kr&target_lang=${code}`,
        option,
      )
        .then((res) => res.json())
        .then((json) => {
          return json.translated_text[0][0].split('.')[0];
        })
        .catch(() => {
          Alert.alert('번역 실패', '다시 시도하거나 직접 입력해주세요');
        });
    } else {
      return fetch(
        `https://dapi.kakao.com/v2/translation/translate?query=${txt}&src_lang=${code}&target_lang=kr`,
        option,
      )
        .then((res) => res.json())
        .then((json) => {
          return json.translated_text[0][0].split('.')[0];
        })
        .catch(() => {
          Alert.alert('번역 실패', '다시 시도하거나 직접 입력해주세요');
        });
    }
  };

  _back = () => {
    this.props.navigation.popToTop();
  };

  _openModal = () => {
    this.setState({
      modalvisible: true,
    });
  };

  // data 저장 없이 close
  _modalclose = () => {
    this.setState({
      modalvisible: false,
      togtr: false,
      toglan: false,
    });
  };

  // asyncstorage에 저장
  _saveToAsyncStorage = async () => {
    const {vocadatas, code} = this.state;
    const savedata = JSON.stringify(vocadatas);
    await AsyncStorage.setItem(code + '', savedata);
  };

  // translated data 저장 후 close
  _modaltrsaveclose = async () => {
    const {vocadatas, txt} = this.state;
    if (txt === '') {
      alert('단어를 입력해주세요');
    } else {
      await this._translateKakao().then((res) => {
        if (typeof res != 'string' || res === '') {
          alert('번역에 실패했습니다.');
          this.txtref.clear();
        } else {
          const id = v4() + '';
          const item = vocadatas;
          const newdata = {
            id: id,
            word: txt,
            translated: res,
            Done: false,
          };
          item[id] = newdata;
          this.setState((prev) => {
            const newstate = {
              ...prev,
              vocadatas: {
                ...item,
                ...prev.vocadatas,
              },
            };
            this._saveToAsyncStorage();
            return {...newstate};
          });
          this.setState({
            modalvisible: false,
            togtr: false,
            toglan: false,
            txt: '',
            sectxt: '',
          });
        }
      });
    }
  };

  // user input data save & close
  _modalsaveclose = async () => {
    const {vocadatas, txt, sectxt} = this.state;

    if (txt === '') {
      alert('단어를 입력해주세요!');
    } else {
      if (sectxt === '') {
        alert('뜻을 입력해주세요!');
      } else {
        const id = v4() + '';
        const item = vocadatas;
        const newdata = {
          id: id,
          word: txt,
          translated: sectxt,
          Done: false,
        };
        item[id] = newdata;
        this.setState((prev) => {
          const newstate = {
            ...prev,
            vocadatas: {
              ...item,
              ...prev.vocadatas,
            },
          };
          this._saveToAsyncStorage();
          return {...newstate};
        });
        this.setState({
          modalvisible: false,
          togtr: false,
          toglan: false,
          txt: '',
          sectxt: '',
        });
      }
    }
  };

  // dataitems.js
  _rightswipebtn = (id) => {
    try {
      this.setState(
        (prev) => {
          const item = prev.vocadatas;
          delete item[id];
          const newstate = {
            ...prev,
            ...item,
          };
          return {...newstate};
        },
        () => {
          this._saveToAsyncStorage();
        },
      );
    } catch {}
  };

  _toggleDone = (item) => {
    this.setState(
      (prev) => {
        let newvoca = {}; // toggle해서 저장한 데이터 포함 단어들 데이터 새로 담을 변수
        Object.values(prev.vocadatas).map((data) => {
          // map돌면서 하나씩 찾기
          let voca = {};
          if (data.id == item.id) {
            voca = {
              ...data,
              Done: !data.Done,
            };
          } else {
            voca = {
              ...data,
            };
          }
          newvoca[data.id] = voca; // 기존의걸 그대로 담거나 Done을 변경해서 담은 voca변수를 하나씩 담음
        });
        const newitem = {
          // 기존의 state와 vocadata를 포함해 return 할 변수
          ...prev,
          vocadatas: newvoca,
        };
        return {...newitem}; // 이렇게까지 한 이유는 setstate시 안드로이드에서 단어들의 순서가 변경되는 버그때문
      },
      () => {
        this._saveToAsyncStorage();
      },
    );
  };

  render() {
    const {modalvisible, name, vocadatas, color} = this.state;
    return (
      <View style={styles.container} ref={(ref) => (this.parent = ref)}>
        <SafeAreaView
          style={{
            ...styles.topbar,
            backgroundColor: color,
          }}>
          <TouchableOpacity style={styles.backbtn} onPress={this._back}>
            <EntypoIcon
              name="chevron-thin-left"
              style={styles.backicon}></EntypoIcon>
          </TouchableOpacity>
          <Text style={styles.lanname}>{name}</Text>
          <TouchableOpacity style={styles.addbtn} onPress={this._openModal}>
            <IonIcon name="add-outline" style={styles.addicon} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* 데이터 나열 */}
        <SwipeListView
          data={Object.values(vocadatas)}
          renderItem={(item, rowmap) => {
            return (
              <View
                style={{
                  ...styles.datas,
                  backgroundColor: color,
                  marginTop: 10,
                }}>
                <View style={styles.datadetails}>
                  <TouchableOpacity
                    style={styles.checkboxbtn}
                    onPress={() => this._toggleDone(item.item)}>
                    <EntypoIcon
                      name="check"
                      style={
                        item.item.Done
                          ? {...styles.checkbox, color: '#dfdfdf'}
                          : styles.checkbox
                      }></EntypoIcon>
                  </TouchableOpacity>
                  <View style={styles.words}>
                    <View style={styles.wordsbox}>
                      <Text
                        style={
                          item.item.Done
                            ? {
                                ...styles.word,
                                color: '#dfdfdf',
                                textDecorationLine: 'line-through',
                              }
                            : styles.word
                        }>
                        {item.item.word}
                      </Text>
                    </View>
                    <View style={styles.wordsbox}>
                      <Text
                        style={
                          item.item.Done
                            ? {
                                ...styles.translated,
                                color: '#dfdfdf',
                                textDecorationLine: 'line-through',
                              }
                            : styles.translated
                        }>
                        {item.item.translated}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          renderHiddenItem={(rowData, rowMap) => {
            return (
              <View
                style={{
                  ...styles.datas,
                  backgroundColor: '#0000',
                  alignItems: 'center',
                  flex: 1,
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{
                    ...styles.rightswipebtn,
                    backgroundColor: color + 'cc',
                  }}
                  onPress={() => {
                    this._rightswipebtn(rowData.item.id);
                  }}>
                  <Text style={{...styles.swipetxt}}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          disableRightSwipe
          rightOpenValue={-100}
          closeOnRowPress={true}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={Platform.OS === 'ios' && {marginBottom: 20}}
        />

        {/* modal start */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalvisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.modalclosebtn}
                onPress={this._modalclose}>
                <IonIcon name={'close-outline'} style={styles.modalclose} />
              </TouchableOpacity>
              <View style={styles.toggleTRbtn}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      togtr: !this.state.togtr,
                    });
                  }}>
                  {this.state.togtr ? (
                    <View style={{...styles.toggleout, backgroundColor: color}}>
                      <View style={[styles.togglein, styles.togglebtn]} />
                    </View>
                  ) : (
                    <View
                      style={{...styles.toggleout, backgroundColor: '#c1c1c1'}}>
                      <View style={styles.togglein}></View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {this.state.togtr && (
                <TouchableOpacity
                  style={styles.toglanguage}
                  onPress={() => {
                    this.setState({
                      toglan: !this.state.toglan,
                    });
                  }}>
                  <Text style={{fontFamily: 'Bazzi'}}>{name} </Text>
                  {this.state.toglan ? (
                    <IonIcon name="arrow-back-outline" />
                  ) : (
                    <IonIcon name="arrow-forward-outline" />
                  )}
                  <Text style={{fontFamily: 'Bazzi'}}> 한국어</Text>
                </TouchableOpacity>
              )}
              <TextInput
                ref={(ref) => (this.txtref = ref)}
                style={styles.modaltxtinput}
                onChangeText={(txt) => {
                  this.setState({
                    txt: txt,
                  });
                }}
                placeholder={'단어 입력'}
                placeholderTextColor={'#dfdfdf'}
                autoFocus={true}
              />
              {!this.state.togtr && (
                <TextInput
                  style={{...styles.modaltxtinput}}
                  onChangeText={(txt) => {
                    this.setState({
                      sectxt: txt,
                    });
                  }}
                  placeholder={'뜻 입력'}
                  placeholderTextColor={'#dfdfdf'}
                />
              )}
              {this.state.togtr ? (
                <TouchableOpacity
                  style={{...styles.modaladdbtn, backgroundColor: color}}
                  onPress={this._modaltrsaveclose}>
                  <Text style={styles.textStyle}>{'번역 & 추가'}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{...styles.modaladdbtn, backgroundColor: color}}
                  onPress={this._modalsaveclose}>
                  <Text style={styles.textStyle}>추가</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  // top navigation
  topbar: {
    width: pwidth,
    height: 160,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowOffset: {
          height: 5,
        },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  backbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 10,
  },
  backicon: {
    color: 'rgba(255,255,255,1)',
    fontSize: 30,
    margin: 5,
  },
  lanname: {
    fontFamily: 'Bazzi',
    color: 'rgba(255,255,255,1)',
    fontSize: 45,
  },

  // data lists
  datas: {
    width: pwidth * 0.8,
    height: 80,
    borderRadius: 18,
    flexDirection: 'row',
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
    justifyContent: 'space-around',
  },
  word: {
    left: 10,
    color: '#121212',
    fontSize: 22,
    fontFamily: 'Bazzi',
  },
  translated: {
    right: 10,
    color: '#121212',
    fontSize: 22,
    fontFamily: 'Bazzi',
  },
  rightswipebtn: {
    height: 80,
    width: 97,
    backgroundColor: 'red',
    right: 0,
    position: 'absolute',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipetxt: {
    fontSize: 20,
    color: '#f1f1f1',
    fontWeight: '800',
  },
  wordsbox: {
    flex: 1,
    alignItems: 'center',
  },
  // add word
  addbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
  },
  addicon: {
    color: 'rgba(255,255,255,1)',
    fontSize: 40,
  },

  // modal
  centeredView: {
    flex: 1,
    alignItems: 'center',
  },
  modalView: {
    top: pheight / 2 - 180,
    width: pwidth * 0.75,
    height: 180,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalclosebtn: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  toggleTRbtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
  },
  toggleout: {
    height: 25,
    width: 40,
    justifyContent: 'center',
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#e1e1e1',
  },
  togglein: {
    height: 21,
    width: 21,
    borderRadius: 11,
    backgroundColor: 'white',
  },
  togglebtn: {
    transform: [{translateX: 15}],
  },
  toglanguage: {
    borderRadius: 10,
    backgroundColor: '#fafafa',
    width: 120,
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
  },
  modalclose: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#b1b1b1',
  },
  modaltxtinput: {
    textAlign: 'center',
    fontSize: 20,
    padding: 0,
    marginBottom: 10,
    fontFamily: 'Bazzi',
  },
  openButton: {
    borderRadius: 20,
    padding: 10,
    width: 70,
  },
  modaladdbtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
  modaladdbtn: {
    borderRadius: 20,
    padding: 10,
    width: 95,
    position: 'absolute',
    bottom: 10,
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Bazzi',
    textAlign: 'center',
  },
});
