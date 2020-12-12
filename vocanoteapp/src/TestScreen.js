import React, {useState} from 'react';
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

const _gotoHome = (navigation) => {
  navigation.goBack();
};

function TestScreen({navigation, route}) {
  const {info, datas} = route.params;

  return (
    <View style={styles.main}>
      <Text>{JSON.stringify(info)}</Text>
      <Text>-------------------------</Text>
      <Text>{JSON.stringify(datas)}</Text>
      <TouchableOpacity
        style={styles.gohomebtn}
        onPress={() => _gotoHome(navigation)}>
        <Text>go to home</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TestScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gohomebtn: {
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
