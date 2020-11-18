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
} from 'react-native';
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory,
} from 'react-native-power-translator';
import App from './App';

const pwidth = Dimensions.get('window').width;
const API_KEY = 'APIKEY';

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
    ) : Platform.OS == 'android' ? (
      <View style={styles.main}>
        <View style={styles.Topbar}></View>
        <View style={styles.contents}></View>
        <View style={styles.bottom}></View>
      </View>
    ) : (
      <SafeAreaView style={styles.main}>
        <View style={styles.Topbar}></View>
        <View style={styles.contents}></View>
        <View style={styles.bottom}></View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  Topbar: {
    flex: 0.1,
    backgroundColor: 'red',
  },
  contents: {
    flex: 1,
    backgroundColor: 'green',
  },
  bottom: {
    flex: 1,
    backgroundColor: 'blue',
  },
});
