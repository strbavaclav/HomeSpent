import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TouchableCmpSelector from '../../helpers/TouchableCmpSelector';
import Colors from '../../styles/Colors';


//Vlastní tlačítko
const CButton = (props) => {

  //deklarování TouchableCmp
  let TouchableCmp = TouchableCmpSelector();

  //deklarace stylů null
  let btnStyle = '';
  let txtStyle = '';

  //rozhodnutí stylů
  if (props.style === 'main') {
    btnStyle = styles.buttonMain;
    txtStyle = styles.buttonTextMain;
  } else {
    btnStyle = styles.buttonOutline;
    txtStyle = styles.buttonTextOutline;
  }

  //tělo komponentu
  return (
    <TouchableCmp
      style={styles.touchableCmpContainer}
      onPress={props.onPress}
    >
      <View style={btnStyle}>
        <Text style={txtStyle}>{props.text}</Text>
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  touchableCmpContainer: { marginTop: 10 },
  buttonMain: {
    backgroundColor: Colors.primaryColor,
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  buttonOutline: {
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  buttonTextMain: {
    color: Colors.white,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonTextOutline: {
    color: Colors.primaryColor,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CButton;
