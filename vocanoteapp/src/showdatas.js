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
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SwipeListView} from 'react-native-swipe-list-view';
import v4 from 'uuid/v4';

const pwidth = Dimensions.get('window').width;
const API_KEY = 'a354f15846c295907ffa112868b14fcd';

export default class Showdatas extends Component {
  state = {
    txt: '', // before translated
    name: this.props.route.params.item.name, // lan name
    code: this.props.route.params.item.code, // lan code
    color: this.props.route.params.item.bcolors.backgroundColor, // lan color
    clicked: false, // to go back
    modalvisible: false, // to show modal
    vocadatas: {}, // save voca datas
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
    const {txt, code} = this.state;
    const option = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `KakaoAK ${API_KEY}`,
      },
    };
    return fetch(
      `https://dapi.kakao.com/v2/translation/translate?query=${txt}&src_lang=${code}&target_lang=kr`,
      option,
    )
      .then((res) => res.json())
      .then((json) => {
        return json.translated_text[0][0].split('.')[0];
      });
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
    });
  };

  // asyncstorage에 저장
  _saveToAsyncStorage = async () => {
    const {vocadatas, code} = this.state;
    const savedata = JSON.stringify(vocadatas);
    await AsyncStorage.setItem(code + '', savedata);
  };

  // data 저장 후 close
  _modalsaveclose = async () => {
    const {vocadatas, txt} = this.state;
    await this._translateKakao().then((res) => {
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
      });
    });
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
        const newitem = {
          ...prev,
          vocadatas: {
            ...prev.vocadatas,
            [item.id]: {
              ...prev.vocadatas[item.id],
              Done: !item.Done,
            },
          },
        };
        return {...newitem};
      },
      () => {
        this._saveToAsyncStorage();
      },
    );
  };

  render() {
    const {clicked, modalvisible, name, code, vocadatas, color} = this.state;
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
        <View style={{width: pwidth, alignItems: 'center'}}>
          <SwipeListView
            data={Object.values(vocadatas)}
            renderItem={(item, rowmap) => {
              return (
                <View style={{...styles.datas, backgroundColor: color}}>
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
            stopRightSwipe={-100}
            closeOnRowPress={true}
            keyExtractor={(item) => item.id}
          />
        </View>

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
              <TextInput
                style={styles.modaltxtinput}
                onChangeText={(txt) => {
                  this.setState({
                    txt: txt,
                  });
                }}
                placeholder={'여기에 입력'}
                placeholderTextColor={'#dfdfdf'}
                autoFocus={true}
              />
              <TouchableOpacity
                style={{...styles.openButton, backgroundColor: color}}
                onPress={this._modalsaveclose}>
                <Text style={styles.textStyle}>추가</Text>
              </TouchableOpacity>
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
    marginBottom: 25,
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
    fontFamily: 'Itim-Regular',
    color: 'rgba(255,255,255,1)',
    fontSize: 45,
    fontWeight: 'bold',
  },

  // data lists
  datas: {
    width: pwidth * 0.8,
    height: 80,
    borderRadius: 18,
    flexDirection: 'row',
    marginBottom: 10,
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
    fontSize: 25,
    fontFamily: 'Itim-Regular',
  },
  translated: {
    right: 10,
    color: '#121212',
    fontSize: 25,
    fontWeight: 'bold',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: pwidth * 0.75,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
  modalclose: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#b1b1b1',
  },
  modaltxtinput: {
    marginBottom: 15,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: 'rgba(242,149,95,1)',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 70,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
