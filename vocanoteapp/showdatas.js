import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  PowerTranslator,
  ProviderTypes,
  TranslatorConfiguration,
  TranslatorFactory,
} from 'react-native-power-translator';

const pwidth = Dimensions.get('window').width;
const API_KEY = '';

_translateWords = () => {
  // translate Korean address to English
  TranslatorConfiguration.setConfig(
    ProviderTypes.Google,
    API_KEY,
    'ko', // target lang
    'en', // source lang
  );
  const translator = TranslatorFactory.createTranslator();
  translator.translate('hello', 'ko').then(
    (res) => {
      console.log(res);
    },
    (error) => {
      console.log(error);
    },
  );
};

export default class Showdatas extends Component {
  render() {
    return <View></View>;
  }
}

const styles = StyleSheet.create({
  lanbox: {
    width: pwidth * 0.4,
    height: 130,
    borderRadius: 20,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnname: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f1f1f1',
  },
});
