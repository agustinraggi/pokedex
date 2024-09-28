import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import Loader from '../components/Loader';

const HomeScreen = ({ navigation }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
        const detailedPokemonList = await Promise.all(
          response.data.results.map(async (pokemon, index) => {
            const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
            return {
              name: pokemon.name,
              id: pokemonResponse.data.id,
              image: pokemonResponse.data.sprites.front_default,
            };
          })
        );
        setPokemonList(detailedPokemonList);
        setFilteredPokemons(detailedPokemonList);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
        setError('Error fetching Pokémon. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPokemons(filtered);
    setPage(0);
  };

  const handlePress = (pokemon) => {
    navigation.navigate('PokemonStats', { pokemonId: pokemon.id });
  };

  const paginatedPokemons = filteredPokemons.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const loadMorePokemons = () => {
    if ((page + 1) * itemsPerPage < filteredPokemons.length) {
      setPage(page + 1);
    }
  };

  const goBackPokemons = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <>
          <TextInput
            placeholder="Buscar Pokémon"
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
          <FlatList
            data={paginatedPokemons}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <PokemonCard name={item.name} image={item.image} />
              </TouchableOpacity>
            )}
            numColumns={3}
            ListFooterComponent={
              <View style={styles.pagination}>
                <TouchableOpacity onPress={goBackPokemons} style={styles.arrowButton} disabled={page === 0}>
                  <Text style={styles.arrowText}>⬅️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={loadMorePokemons} style={styles.arrowButton} disabled={(page + 1) * itemsPerPage >= filteredPokemons.length}>
                  <Text style={styles.arrowText}>➡️</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    padding: 10,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    width: 220,
    marginTop: 120,
    textAlign: 'center',
    marginLeft: 70,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
    color: 'blue',
  },
});

export default HomeScreen;
