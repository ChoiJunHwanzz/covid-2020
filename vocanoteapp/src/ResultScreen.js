import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useRef} from 'react';
import {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  BackHandler,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import IonIcon from 'react-native-vector-icons/Ionicons';

const pwidth = Dimensions.get('window').width;
const pheight = Dimensions.get('window').height;

function ResultScreen({navigation, route}) {
  const {results, info} = route.params;

  let wrongBox = useRef(); // 틀린 단어들 블럭
  let correctBox = useRef(); // 맞은 단어들 블럭

  // set android back button callback
  const backAction = () => {
    navigation.pop();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  //틀린 단어들
  const correct = Object.values(results).filter((item) => {
    return item.correct == true;
  });

  // 맞은 단어들
  const wrong = Object.values(results).filter((item) => {
    return item.correct == false;
  });

  const wrongBlock = (word, idx) => {
    return (
      <View style={styles.reviewdatas}>
        <TouchableOpacity
          style={
            idx !== 0
              ? {...styles.moveBoxBtn, left: 10}
              : {
                  ...styles.moveBoxBtn,
                  left: 10,
                  display: 'none',
                  position: 'relative', // for android
                }
          }
          onPress={() => {
            wrongBox.snapToPrev();
          }}>
          <IonIcon style={styles.moveBoxIcon} name={'chevron-back-outline'} />
        </TouchableOpacity>
        <View style={styles.textBox}>
          <Text style={styles.wordtxt}>{word.word}</Text>
          <Text style={{...styles.resultWord, color: '#76C1E2'}}>
            {word.translated}
          </Text>
          <Text style={{...styles.resultWord, color: '#EB6060'}}>
            {word.result}
          </Text>
        </View>
        <TouchableOpacity
          style={
            idx !== wrong.length - 1 && wrong.length !== 0
              ? {...styles.moveBoxBtn, right: 10}
              : {
                  ...styles.moveBoxBtn,
                  right: 10,
                  display: 'none',
                  position: 'relative', // for android
                }
          }
          onPress={() => {
            wrongBox.snapToNext();
          }}>
          <IonIcon
            style={styles.moveBoxIcon}
            name={'chevron-forward-outline'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const correctBlock = (word, idx) => {
    return (
      <View style={styles.reviewdatas}>
        <TouchableOpacity
          style={
            idx !== 0
              ? {...styles.moveBoxBtn, left: 10}
              : {
                  ...styles.moveBoxBtn,
                  left: 10,
                  display: 'none',
                  position: 'relative', // for android
                }
          }
          onPress={() => {
            correctBox.snapToPrev();
          }}>
          <IonIcon style={styles.moveBoxIcon} name={'chevron-back-outline'} />
        </TouchableOpacity>
        <View style={styles.textBox}>
          <Text style={styles.wordtxt}>{word.word}</Text>
          <Text style={styles.resultWord}>{word.result}</Text>
        </View>
        <TouchableOpacity
          style={
            idx !== correct.length - 1 && correct.length !== 0
              ? {...styles.moveBoxBtn, right: 10}
              : {
                  ...styles.moveBoxBtn,
                  right: 10,
                  display: 'none',
                  position: 'relative', // for android
                }
          }
          onPress={() => {
            correctBox.snapToNext();
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
      <View style={{backgroundColor: '#76C1E2'}}>
        <SafeAreaView>
          <View style={styles.topbar}></View>
        </SafeAreaView>
      </View>
      <View style={styles.Boxtitle}>
        <Text
          style={[
            styles.Boxtitletxt,
            {
              color: '#EB6060',
            },
          ]}>{`wrong : ${Object.values(results).length}/${wrong.length}`}</Text>
      </View>
      <View style={styles.databoxes}>
        <Carousel
          ref={(ref) => (wrongBox = ref)}
          layout={'default'}
          data={
            wrong.length > 0
              ? wrong
              : [
                  {
                    word: '축하합니다!',
                    result: '',
                    translated: '틀린 단어가 없습니다!',
                  },
                ]
          }
          renderItem={({item, index}) => wrongBlock(item, index)}
          sliderWidth={pwidth}
          itemWidth={pwidth - 50}
          scrollEnabled={wrong.length > 0}
        />
      </View>
      <View style={styles.Boxtitle}>
        <Text style={[styles.Boxtitletxt, {color: '#77C1E1'}]}>{`correct : ${
          Object.values(results).length
        }/${correct.length}`}</Text>
      </View>
      <View style={styles.databoxes}>
        <Carousel
          ref={(ref) => (correctBox = ref)}
          layout={'default'}
          data={
            correct.length > 0
              ? correct
              : [{word: '맞춘 단어가 없습니다.', result: '다시 도전해보세요!'}]
          }
          renderItem={({item, index}) => correctBlock(item, index)}
          sliderWidth={pwidth}
          itemWidth={pwidth - 50}
          scrollEnabled={correct.length > 0}
        />
      </View>
      {correct.length > 0 && (
        <TouchableOpacity
          onPress={async () => {
            const datas = await AsyncStorage.getItem(info.code + '');
            let parsed = JSON.parse(datas);
            correct.forEach((item) => {
              delete parsed[item.id];
            });
            const savedata = JSON.stringify(parsed);
            await AsyncStorage.setItem(info.code + '', savedata);
            navigation.popToTop();
          }}>
          <View style={styles.exceptview}>
            <Text style={styles.excepttxt}>맞은 단어 삭제</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ResultScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
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
    height: 230,
    justifyContent: 'center',
  },

  textBox: {
    width: pwidth - 190,
    height: 160,

    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wordtxt: {
    fontSize: 30,
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
  },

  submitbtn: {
    width: pwidth - 50,
    height: 60,
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

  Boxtitle: {
    marginTop: 10,
    borderRadius: 10,
  },
  Boxtitletxt: {
    fontFamily: 'Itim-Regular',
    fontSize: 30,
  },

  resultWord: {
    color: '#818181',
    fontSize: 22,
    fontFamily: 'Bazzi',
  },

  exceptview: {
    width: pwidth - 50,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#76C1E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  excepttxt: {
    fontSize: 25,
    color: '#f1f1f1',
    fontFamily: 'Bazzi',
  },
});
