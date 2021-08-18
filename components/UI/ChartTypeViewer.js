import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Colors from '../../styles/Colors';


//komponent ChartTypeViewer
const ChartTypeViewer = (props) => {

  //deklarování statu pro zvolený grafický přehled
  const [selected, setSelected] = useState('All');


  //tělo komponentu
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setSelected('All')}
        style={selected === 'All' ? styles.optionTile : styles.optionTile2}
      >
        <Text
          style={selected === 'All' ? styles.activeText : styles.deactiveText}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelected('Y')}
        style={selected === 'Y' ? styles.optionTile : styles.optionTile2}
      >
        <Text
          style={selected === 'Y' ? styles.activeText : styles.deactiveText}
        >
          Y
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelected('M')}
        style={selected === 'M' ? styles.optionTile : styles.optionTile2}
      >
        <Text
          style={selected === 'M' ? styles.activeText : styles.deactiveText}
        >
          M
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelected('Select')}
        style={selected === 'Select' ? styles.optionTile : styles.optionTile2}
      >
        <Text
          style={
            selected === 'Select' ? styles.activeText : styles.deactiveText
          }
        >
          Select
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '80%',
    height: 26,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  optionTile: {
    marginHorizontal: 2,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: '23%',
    height: '100%',
    borderRadius: 8,
  },
  optionTile2: {
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '23%',
    height: '100%',
    borderRadius: 8,
  },
  activeText: { color: Colors.white },
  deactiveText: { color: Colors.primaryColor },
});

export default ChartTypeViewer;
