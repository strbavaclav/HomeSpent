import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

//komponent NoComodities
const NoDataView = () => {
  //tělo komponentu
  return (
    <View style={styles.noComs}>
      <MaterialIcons
        name='timer-off'
        size={100}
        color='lightgrey'
        style={styles.IconStyle}
      />
      <Text style={styles.infoText}>None of the records</Text>
      <Text style={styles.infoText}>fits in the chosen time period</Text>
      <Text style={styles.infoText}>Add some now!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noComs: {
    flex: 1,
    marginTop: 50,
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

export default NoDataView;
