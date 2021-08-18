import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


//komponent EmptyComodityDetail
const EmptyComodityDetail = () => {

  //tělo komponentu
  return (
    <View style={styles.noComs}>
      <MaterialCommunityIcons
        name='database-minus'
        size={100}
        color='lightgrey'
        style={styles.iconStyle}
      />
      <Text style={styles.infoText}>You have not stored</Text>
      <Text style={styles.infoText}>any data yet.</Text>
      <Text style={styles.infoText}>You can enter some by the</Text>
      <Text style={styles.infoText}>blue plus button</Text>
      <Text style={styles.infoText}>in right down corner.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noComs: {
    flex: 1,
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
  iconStyle: {
    marginBottom: 20,
  },
});

export default EmptyComodityDetail;
