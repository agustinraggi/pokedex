import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import PokemonCard from './PokemonCard';
import Loader from '../components/Loader';

// traduccion de los nombres de los pokemones con su color 
const typeTranslations = {
  normal: { name: 'Normal', color: '#A8A77A' },
  fighting: { name: 'Lucha', color: '#C22E28' },
  flying: { name: 'Volador', color: '#A98FF3' },
  poison: { name: 'Veneno', color: '#A33EA1' },
  ground: { name: 'Tierra', color: '#E2BF65' },
  rock: { name: 'Roca', color: '#B6A136' },
  bug: { name: 'Bicho', color: '#A8B820' },
  ghost: { name: 'Fantasma', color: '#735797' },
  steel: { name: 'Acero', color: '#B7B7CE' },
  fire: { name: 'Fuego', color: '#FBAE24' },
  water: { name: 'Agua', color: '#6390F0' },
  grass: { name: 'Planta', color: '#7AC74C' },
  electric: { name: 'Eléctrico', color: '#F7D02C' },
  psychic: { name: 'Psíquico', color: '#F95587' },
  ice: { name: 'Hielo', color: '#96D9D6' },
  dragon: { name: 'Dragón', color: '#6F35FC' },
  fairy: { name: 'Hada', color: '#D685AD' },
};

const HomeScreen = ({ navigation }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const flatListRef = useRef(null);

  // hacemos el llamado a la api y traemos 150 pokemones y traemos su id, imagen, nombre y el tipo
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
              types: pokemonResponse.data.types.map(type => type.type.name),
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

  // aca lo que hacemos es el motor de busqueda por nombre del pokemon
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPokemons(filtered);
    setPage(0);
  };

  // cuando aprieta a un pokemon lo lleva a ver sus estadisticas
  const handlePress = (pokemon) => {
    navigation.navigate('PokemonStats', { pokemonId: pokemon.id });
  };

  // hacemos el paginado para no ver a todos los pokemones sino cada 30
  const paginatedPokemons = filteredPokemons
    .filter(pokemon => !selectedType || pokemon.types.includes(selectedType))
    .slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  // para pasar a la siguiente pagina 
  const loadMorePokemons = () => {
    if ((page + 1) * itemsPerPage < filteredPokemons.length) {
      setPage(page + 1);
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  // para volver a la anterior pagina
  const goBackPokemons = () => {
    if (page > 0) {
      setPage(page - 1);
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  return (
    // aca al inciar lo que se hace es pregunrar si no hay errores si no hay hacemos una espera para traer los datos de los pokenes
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

          {/* aca lo que hacemos es mostrar la filtraciones de los tipos de pokemones */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeContainer}>
            {Object.entries(typeTranslations).map(([key, { name, color }]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedType(selectedType === key ? null : key)}
                style={[styles.typeButton, { backgroundColor: selectedType === key ? color : '#f0f0f0' }]} >
                <Text style={styles.typeText}>{name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* aca traemos los pokemones para mostrarlos */}
          <FlatList
            ref={flatListRef}
            data={paginatedPokemons}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePress(item)}>
                <PokemonCard name={item.name} image={item.image} />
              </TouchableOpacity>
            )}
            // aca lo que hacemos es el llamado para pasar a la siguiente pagina
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
    width: '80%',
    alignSelf: 'center',
    marginTop: 120,
    textAlign: 'center',
  },
  typeContainer: {
    height: 140,
    paddingVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    marginBottom: 45,
  },
  typeButton: {
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    height: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50, 
    paddingVertical: 20,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 20,
  },
});

export default HomeScreen;
