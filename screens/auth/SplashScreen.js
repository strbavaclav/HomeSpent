import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  //deprecated - pořád možné využít
  AsyncStorage,
} from 'react-native';

//import redux akcí
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';

import Colors from '../../styles/Colors';

const SplashScreen = (props) => {
  const dispatch = useDispatch();

  //Pokus o načtení UserData z LocalStorage
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        dispatch(authActions.setDidTryAL());
        return;
      }

      //práce s daty z LocalStorage
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      //ověření životnosti tokenu
      if (expirationDate <= new Date() || !token || !userId) {
        dispatch(authActions.setDidTryAL());
        return;
      }

      //prodloužení expiračního tokenu
      const expirationTime = expirationDate.getTime() - new Date().getTime();
      dispatch(authActions.authenticate(userId, token, expirationTime));
      dispatch(userActions.fetchUsers());
    };

    //pokus o přihlášení
    tryLogin();
    
  }, [dispatch]);

  //Zobrazení načítaní
  return (
    <View style={styles.screen}>
      <ActivityIndicator size='large' color={Colors.primaryColor} />
    </View>
  );
};

//stylování obrazovky
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
