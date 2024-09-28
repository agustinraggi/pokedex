import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Header from './pages/header';
import Home from './pages/HomeScreen';
import PokemonStats from './pages/PokemonStats';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator
          screenOptions={{
            header: () => <Header />,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="PokemonStats" component={PokemonStats} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
