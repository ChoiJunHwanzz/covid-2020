import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/HomeScreen';
import TestScreen from './src/TestScreen';
import Showdatas from './src/showdatas';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={HomeScreen} headerMode={'none'}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Testscreen" component={TestScreen} />
        <Stack.Screen name="Datas" component={Showdatas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
