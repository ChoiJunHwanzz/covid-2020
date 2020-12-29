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
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pwidth = Dimensions.get('window').width;

export default class LanBox extends Component {
  state = {
    isdeleting: false,
  };
  deletebox = async (item) => {
    // delete words
    await AsyncStorage.removeItem(item.code + '');

    // get lan types to delete
    const lans = await AsyncStorage.getItem('vocaDatas');
    let lansparsed = JSON.parse(lans);
    const idx = lansparsed.findIndex((lan) => {
      return lan.id == item.id;
    });

    // get usable colors
    const colors = await AsyncStorage.getItem('colorSelection');
    let parsedcolors = JSON.parse(colors);

    // to insert item datas in addable languages list
    const addable = await AsyncStorage.getItem('addableLan');
    let addableparsed = JSON.parse(addable);
    const addlan = {
      name: item.name,
      code: item.code,
    };
    const usablecolors = {
      color: item.bcolors.backgroundColor,
    };
    parsedcolors.push(usablecolors); // add color that this item used to make it usable
    addableparsed.push(addlan); // add item to addable lans
    lansparsed.splice(idx, 1); // delete item from lans list which is rendered as lanbox

    const colorparsed = JSON.stringify(parsedcolors);
    await AsyncStorage.setItem('colorSelection', colorparsed);

    const saveparsed = JSON.stringify(lansparsed);
    await AsyncStorage.setItem('vocaDatas', saveparsed);

    const parsedaddable = JSON.stringify(addableparsed);
    await AsyncStorage.setItem('addableLan', parsedaddable);
    this.setState({
      isdeleting: false,
      goTestPage: false,
    });
  };
  render() {
    const {isdeleting, goTestPage} = this.state;
    return this.props.item.id != 'add' ? (
      <View style={[styles.lanbox, this.props.item.bcolors]}>
        {isdeleting && (
          <TouchableOpacity
            style={styles.deletebtn}
            onPress={() => this.deletebox(this.props.item)}>
            <View style={styles.deleteview}>
              <IonIcon
                name={'close-outline'}
                size={25}
                style={{color: '#f1f1f1'}}
              />
            </View>
          </TouchableOpacity>
        )}
        <Text style={styles.btnname}>
          {goTestPage
            ? this.props.item.name + '\n테스트'
            : this.props.item.name}
        </Text>
      </View>
    ) : (
      // add는 따로 구현
      <View style={[styles.lanbox, this.props.item.bcolors]}>
        <Text style={styles.btnname}>{this.props.item.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  lanbox: {
    // width: pwidth * 0.8,
    // margin: (pwidth - pwidth * 0.8) / 2,
    width: pwidth * 0.38,
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
  btnname: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f1f1f1',
  },
  deletebtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
    top: -10,
    left: -10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  deleteview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#bababa',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1d1d1',
    margin: 0,
    padding: 0,
  },
});
