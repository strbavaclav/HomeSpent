import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { FontAwesome } from '@expo/vector-icons';
import Headerbutton from '../components/UI/HeaderButton';
import Colors from '../styles/Colors';


//stránka AboutScreen
const AboutScreen = () => {

  //tělo komponentu
  return (
    <View style={styles.screen}>
      <FontAwesome name='info-circle' size={150} color={Colors.primaryColor} />
      <Text style={styles.textAbout}>
        The Home$pent application was created as a result of a bachelor's thesis
        for the design and implementation of a mobile application for real
        estate finance management at the University of Economics in the field of
        applied informatics.
      </Text>

      <Text>You can write your feedback to vstrba@outlook.com</Text>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text>Home$pent beta v1.2</Text>
        <Text>Author: Václav Štrba</Text>
        <Text>{'\u00A9'}2021</Text>
      </View>
    </View>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: 'About app',
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={Headerbutton}>
          <Item
            title='Menu'
            iconName='ios-menu'
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  textAbout: { textAlign: 'center', margin: 20 },
  logoContainer: { marginTop: 50, alignItems: 'center' },
  logo: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
});

export default AboutScreen;
