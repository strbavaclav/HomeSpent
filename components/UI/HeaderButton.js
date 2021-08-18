import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../styles/Colors';

//komponent CustomHeaderButton
const CustomHeaderButton = (props) => {

  //tělo komponentu
  return (
    <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} color={Colors.primaryColor} />
  );
};

export default CustomHeaderButton;
