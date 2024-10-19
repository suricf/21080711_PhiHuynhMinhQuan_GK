import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Screen_01 from './Screens/Screen_01'
import Screen_02 from './Screens/Screen_02'
// import Screen03 from './Screens/Screen03'
// import Screen04 from './Screens/Screen04'
// import Screen05 from './Screens/Screen05'
const Stack = createNativeStackNavigator()
export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Screen_01'
        headerShow={false}
      >
        <Stack.Screen name="Screen_01" component={Screen_01}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Screen_02" component={Screen_02}
          options={{ headerShown: false }}
        ></Stack.Screen>
        {/* <Stack.Screen name="Screen03" component={Screen03}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Screen04" component={Screen04}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen name="Screen05" component={Screen05}
          options={{ headerShown: false }}
        ></Stack.Screen> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}