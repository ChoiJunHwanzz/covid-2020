import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import IonIcon from 'react-native-vector-icons/Ionicons';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

function TestScreen({navigation, route}) {
  const {info, datas} = route.params;
  const [input, setInput] = useState({});
  const [results, setResults] = useState({});

  let wordBox = useRef();

  const _onChangetxt = (txt, word) => {
    const newinput = {
      ...word,
      result: txt,
      correct:
        txt.replace(/ /gi, '').toLowerCase() ==
        word.translated.replace(/ /gi, '').toLowerCase(),
    };
    setInput(newinput);
  };

  const _onMovePage = (word) => {
    if (word.id == input.id) {
      setResults((prev) => ({
        ...prev,
        [word.id]: input,
      }));
    }
  };

  const _setResults = () => {
    if (input.id != undefined) {
      setResults((prev) => ({
        ...prev,
        [input.id]: input,
      }));
    }
  };

  const datasBlock = (word, idx) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          _setResults();
          Keyboard.dismiss();
        }}>
        <View style={styles.reviewdatas}>
          <TouchableOpacity
            style={
              idx == 0
                ? {
                    ...styles.moveBoxBtn,
                    left: 10,
                    display: 'none',
                    position: 'relative', // for android
                  }
                : {...styles.moveBoxBtn, left: 10}
            }
            onPress={() => {
              _onMovePage(word);
              wordBox.snapToPrev();
            }}>
            <IonIcon style={styles.moveBoxIcon} name={'chevron-back-outline'} />
          </TouchableOpacity>
          <View style={styles.textBox}>
            <Text style={styles.wordtxt}>{word.word}</Text>
            <TextInput
              style={styles.translatetxt}
              placeholder={'해석 입력'}
              placeholderTextColor={'#aeaeae'}
              onChangeText={(txt) => {
                _onChangetxt(txt, word);
              }}
              onSubmitEditing={() => {
                _setResults();
              }}
            />
          </View>
          <TouchableOpacity
            style={
              idx !== Object.values(datas).length - 1
                ? {...styles.moveBoxBtn, right: 10}
                : {
                    ...styles.moveBoxBtn,
                    right: 10,
                    display: 'none',
                    position: 'relative', // for android
                  }
            }
            onPress={() => {
              _onMovePage(word);
              wordBox.snapToNext();
            }}>
            <IonIcon
              style={styles.moveBoxIcon}
              name={'chevron-forward-outline'}
            />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.main}>
      <View style={{backgroundColor: '#76C1E2'}}>
        <SafeAreaView>
          <View style={styles.topbar}></View>
        </SafeAreaView>
      </View>
      <View style={styles.databoxes}>
        <Carousel
          ref={(ref) => (wordBox = ref)}
          layout={'default'}
          data={Object.values(datas)}
          renderItem={({item, index}) => datasBlock(item, index)}
          sliderWidth={pwidth}
          itemWidth={pwidth - 50}
          scrollEnabled={false}
        />
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          _setResults();
          Keyboard.dismiss();
        }}>
        <View
          style={{
            justifyContent: 'space-around',
            height: pheight,
          }}>
          <TouchableOpacity
            style={styles.submitbtn}
            onPress={() => {
              Alert.alert(
                '제출',
                '충분한 검토가 완료되었습니까?',
                [
                  {
                    text: '취소',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: '제출',
                    onPress: () => {
                      if (
                        Object.values(results).length !=
                        Object.values(datas).length
                      ) {
                        Alert.alert(
                          '포기하지 마세요!',
                          '답안을 모두 작성해주시길 바랍니다.',
                        );
                      } else {
                        navigation.push('ResultScreen', {
                          results: results,
                          info: info,
                        });
                      }
                    },
                  },
                ],
                {cancelable: false},
              );
            }}>
            <Text style={styles.submittxt}>Submit</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default TestScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  topbar: {
    width: pwidth,
    height: pheight * 0.07,
    backgroundColor: '#76C1E2',
    top: 0,
  },

  // datas
  reviewdatas: {
    width: pwidth - 50,
    height: 200,
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#e9e9e9',
    padding: 15,
    ...Platform.select({
      ios: {
        shadowOffset: {
          height: 5,
        },
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 8,
      },
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // datas container
  moveBoxBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  moveBoxIcon: {
    fontSize: 50,
    color: '#d5d5d5',
  },

  databoxes: {
    height: 250,
    justifyContent: 'center',
    paddingTop: 25,
  },

  textBox: {
    width: pwidth - 190,
    height: 160,

    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wordtxt: {
    fontSize: 25,
    fontFamily: 'Bazzi',
  },
  translatetxt: {
    height: 40,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#e1e1e1',
    paddingHorizontal: 10,
    color: '#515151',
    borderRadius: 8,
    fontFamily: 'Bazzi',
  },

  submitbtn: {
    width: pwidth - 50,
    height: 60,
    bottom: 20,
    margin: 25,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#86d1f2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#76C1E2',
  },
  submittxt: {
    color: '#222',
    fontSize: 30,
    fontFamily: 'Itim-Regular',
  },
});
