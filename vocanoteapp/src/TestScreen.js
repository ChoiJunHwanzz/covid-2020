import React, {useState, useRef} from 'react';
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
  FlatList,
  Keyboard,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import IonIcon from 'react-native-vector-icons/Ionicons';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

function TestScreen({route}) {
  const {info, datas} = route.params;
  let wordBox = useRef();

  const datasBlock = (word) => {
    return (
      <View style={styles.reviewdatas}>
        <TouchableOpacity
          style={styles.moveBoxBtn}
          onPress={() => {
            wordBox.snapToPrev();
          }}>
          <IonIcon style={styles.moveBoxIcon} name={'chevron-back-outline'} />
        </TouchableOpacity>
        <Text>{word.word}</Text>
        <TouchableOpacity
          style={styles.moveBoxBtn}
          onPress={() => {
            wordBox.snapToNext();
          }}>
          <IonIcon
            style={styles.moveBoxIcon}
            name={'chevron-forward-outline'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.topbar}></View>
      <Carousel
        ref={(ref) => (wordBox = ref)}
        layout={'default'}
        data={Object.values(datas)}
        renderItem={({item}) => datasBlock(item)}
        sliderWidth={pwidth}
        itemWidth={pwidth - 30}
        style={styles.databoxes}
      />
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
  topbar: {
    width: pwidth,
    height: 90,
    backgroundColor: '#76C1E2',
    // position: 'absolute',
    top: 0,
  },

  // datas
  reviewdatas: {
    width: pwidth - 30,
    height: 190,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#e9e9e9',
    marginHorizontal: 5,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 8,
      },
    }),
    flexDirection: 'row',
  },

  // datas container
  moveBoxBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveBoxIcon: {
    fontSize: 30,
  },
});
