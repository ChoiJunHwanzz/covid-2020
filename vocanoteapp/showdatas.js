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
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory,
} from 'react-native-power-translator';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import App from './App';

const pwidth = Dimensions.get('window').width;
const API_KEY = 'AIzaSyAUf_YUFn0FhwQU8grgK90NmRtDGooxUkU';

export default class Showdatas extends Component {
  state = {
    trtxt: this.props.item.data,
    clicked: false,
    modalvisible: false, //
  };
  _translateWords = (data) => {
    // translate Korean address to English
    TranslatorConfiguration.setConfig(
      ProviderTypes.Google,
      API_KEY,
      'ko', // target lang
    );
    const translator = TranslatorFactory.createTranslator();
    translator.translate(data, 'ko').then(
      (res) => {
        this.setState({
          trtxt: res,
        });
      },
      (error) => {
        console.log(error);
      },
    );
  };
  _back = () => {
    this.setState({
      clicked: true,
    });
  };

  _adddatas = () => {
    this.setState({
      modalvisible: true,
    });
    console.log('add button');
  };

  // data 저장 없이 close
  _modalclose = () => {
    this.setState({
      modalvisible: false,
    });
  };

  // data 저장 후 close
  _modalsaveclose = () => {
    this.setState({
      modalvisible: false,
    });
  };

  render() {
    const {trtxt, clicked, modalvisible} = this.state;
    return clicked ? (
      <App />
    ) : (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.backbtn} onPress={this._back}>
            <EntypoIcon
              name="chevron-thin-left"
              style={styles.backicon}></EntypoIcon>
          </TouchableOpacity>
          <Text style={styles.lanname}>영어</Text>
          <TouchableOpacity style={styles.addbtn} onPress={this._adddatas}>
            <IonIcon name="add-outline" style={styles.addicon} />
          </TouchableOpacity>
        </View>
        <View style={styles.datas}>
          <View style={styles.datadetails}>
            <TouchableOpacity style={styles.checkboxbtn}>
              <EntypoIcon name="check" style={styles.checkbox}></EntypoIcon>
            </TouchableOpacity>
            <View style={styles.words}>
              <Text style={styles.word}>functionality</Text>
              <Text style={styles.translated}>기능성</Text>
            </View>
          </View>
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
                placeholder={'여기에 입력'}
                autoFocus={true}
              />
              <TouchableOpacity
                style={styles.openButton}
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
    height: 163,
    backgroundColor: 'rgba(242,149,95,1)',
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 25,
  },
  backbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 10,
  },
  backicon: {
    color: 'rgba(255,255,255,1)',
    fontSize: 30,
    margin: 5,
  },
  lanname: {
    fontFamily: 'verdana-regular',
    color: 'rgba(255,255,255,1)',
    fontSize: 45,
  },

  // data lists
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

  // add word
  adddatas: {
    width: pwidth * 0.8,
    height: 80,
    backgroundColor: 'rgba(242,149,95,1)',
    borderRadius: 18,
    marginBottom: 25,
    padding: 5,
  },
  addbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
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
