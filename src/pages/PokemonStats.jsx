import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';

// traduccion al español de los tipos de pokemones
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
  dark: { name: 'Siniestro', color: '#705746' },
  unknown: { name: 'Desconocido', color: '#A8A77A' },
  shadow: { name: 'Sombra', color: '#000000' },
};

const PokemonStats = ({ route }) => {
  const { pokemonId } = route.params;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // llamada a la api
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        setStats(response.data);
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        setError('Error fetching Pokémon stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [pokemonId]);

  if (loading) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  // preguntamos si hay imagen en caso que no nis devuelve null
  const pokemonImage = stats.sprites ? stats.sprites.front_default : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stats.name}</Text>
      {pokemonImage ? (
        <Image source={{ uri: pokemonImage }} style={styles.image} />
      ) : (
        <Text style={styles.error}>No hay imagen disponible</Text>
      )}
      
      <View style={styles.typesContainer}>
        {stats.types.map((typeInfo) => {
          const type = typeTranslations[typeInfo.type.name];
          return (
            <Text key={typeInfo.type.name} style={[styles.type, { backgroundColor: type.color }]}>
              {type.name}
            </Text>
          );
        })}
      </View>

        {/* mostramos las estadisticas de los pokemones */}
      <Text style={styles.statTitle}>Estadísticas:</Text>
      <View style={styles.statsContainer}>
        {Array.isArray(stats.stats) ? stats.stats.map((stat, index) => (
          <View key={index} style={styles.statContainer}>
            <Text style={styles.statLabel}>{stat.stat.name}: {stat.base_stat}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${stat.base_stat}%` }]} />
            </View>
          </View>
        )) : <Text>No stats available</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  loading: {
    fontSize: 18,
    color: 'blue',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  typesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  type: {
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 5,
    fontWeight: 'bold',
    color: '#fff',
  },
  statTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  statsContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statContainer: {
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 18,
    color: '#555',
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 10,
  },
});

export default PokemonStats;
