import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.png';

const Header = () => {
    const navigation = useNavigation();
    const handleTitle = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={handleTitle} style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        top: 0,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginTop: 10,
        width: 150,
        height: 120,
        resizeMode: 'contain',
    },
});

export default Header;
