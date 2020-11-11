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
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory,
} from 'react-native-power-translator';
import App from './App';

const pwidth = Dimensions.get('window').width;
const API_KEY = '';

export default class Showdatas extends Component {
  state = {
    trtxt: this.props.item.data,
    clicked: false,
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

  render() {
    const {trtxt, clicked} = this.state;
    return clicked ? (
      <App />
    ) : (
      <View style={styles.main}>
        <Text style={styles.txt}>{this.props.item.name}</Text>
        <Text style={styles.txt}>{trtxt}</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={this._translateWords.bind(this, this.props.item.data)}>
          <Text>translate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this._back}>
          <Text>back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 30,
  },
  btn: {
    width: 100,
    height: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
