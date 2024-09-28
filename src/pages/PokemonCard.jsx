import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const PokemonCard = ({ name, image }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.text}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
  },
});

export default PokemonCard;
