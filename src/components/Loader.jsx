import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Loader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 400, 
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-20deg', '20deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={styles.loaderContainer}>
      <Animated.View style={[styles.pokeball, animatedStyle]}>
        <View style={styles.pokeballTop} />
        <View style={styles.pokeballBottom} />
        <View style={styles.pokeballLine} />
        <View style={styles.pokeballCenter} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokeball: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },

  pokeballTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#F93318',
  },

  pokeballBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
  },

  pokeballLine: {
    position: 'absolute',
    top: '48%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#000',
  },

  pokeballCenter: {
    position: 'absolute',
    top: '42%',
    left: '42%',
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
});

export default Loader;
