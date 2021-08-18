//Navigační systém aplikace - vnější
import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

//import navigačních komponent
import { AppNavigator, AuthNavigator } from './AppNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

const MainNavigator = (props) => {
  
  //ověření přihlášeného uživatele
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  //výběr správného navigačního podsystému
  return (
    <NavigationContainer>
      {isAuth && <AppNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <SplashScreen />}
    </NavigationContainer>
  );
};

export default MainNavigator;
