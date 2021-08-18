import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import TouchableCmpSelector from '../../helpers/TouchableCmpSelector';
import Colors from '../../styles/Colors';


//komponent FloatingButton
const FloatingButton = (props) => {

  //deklarování TouchableCmp
  let TouchableCmp = TouchableCmpSelector();


  //tělo komponentu
  return (
    <TouchableCmp
      style={[styles.button, styles.container]}
      onPress={props.onSelect}
    >
      <View style={styles.touchable}>
        <AntDesign name='plus' size={24} color={Colors.white} />
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 30,
    zIndex: 1,
  },

  button: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(23,120,242,0.8)',
  },
});

export default FloatingButton;
