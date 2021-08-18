import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

//komponent NoComodities
const NoComodities = () => {

  //tělo komponentu
  return (
    <View style={styles.noComs}>
      <MaterialIcons
        name='layers-clear'
        size={100}
        color='lightgrey'
        style={styles.IconStyle}
      />
      <Text style={styles.infoText}>Upsss..</Text>
      <Text style={styles.infoText}>It's looks like you</Text>
      <Text style={styles.infoText}>dont manage any realty yet.</Text>
      <Text style={styles.infoText}>You can join one under</Text>
      <Text style={styles.infoText}>or</Text>
      <Text style={styles.infoText}>create new in right corner.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noComs: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 150,
  },
  infoText: {
    color: 'grey',
    fontSize: 20,
    marginVertical: 3,
    marginHorizontal: 25,
    textAlign: 'center',
  },
  IconStyle: {
    marginBottom: 20,
  },
});

export default NoComodities;
