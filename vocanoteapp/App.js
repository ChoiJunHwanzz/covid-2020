import 'react-native-gesture-handler';
import React from 'react';
import {Platform} from 'react-native';
import {
  NavigationContainer,
  StackViewTransitionConfigs,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  HeaderBackButton,
} from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './src/HomeScreen';
import TestScreen from './src/TestScreen';
import Showdatas from './src/showdatas';
import ResultScreen from './src/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={HomeScreen}
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="Testscreen"
          component={TestScreen}
          options={({route}) => ({
            headerLeft: (props) => (
              <MaterialIcons
                name={'arrow-back-ios'}
                {...props}
                size={30}
                style={{color: '#f1f1f1'}}
              />
            ),
            title: route.params.info.name + ' Test',
            headerTintColor: '#f1f1f1',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30,
            },
            headerStyle: {
              backgroundColor: '#76C1E2',
              // height: 90,
            },
            // headerBackAllowFontScaling: true,
            headerTransparent: true,
            headerTitleAlign: 'center',
            headerLeftContainerStyle: {
              fontSize: 30,
              width: 50,
              alignItems: 'center',
            },
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          })}
        />
        <Stack.Screen
          name="Datas"
          component={Showdatas}
          options={{
            header: () => null,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={({navigation}) => ({
            headerLeft: (props) => (
              <MaterialIcons
                name={'arrow-back-ios'}
                {...props}
                size={30}
                style={{color: '#f1f1f1'}}
                onPress={() => navigation.pop()}
              />
            ),
            headerLeftContainerStyle: {
              fontSize: 30,
              width: 50,
              alignItems: 'center',
            },
            headerTransparent: true,
            title: 'Result',
            headerTintColor: '#f1f1f1',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 30,
            },
            headerTitleAlign: 'center',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
