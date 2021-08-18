import React, { useState } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { enableScreens } from 'react-native-screens';

//redux dependecies
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { LogBox } from 'react-native';

//importy komponentů
import MainNavigator from './navigation/MainNavigator';
import comoditiesReducer from './store/reducers/comodities';
import recordsReducer from './store/reducers/records';
import authReducer from './store/reducers/auth';
import usersReducer from './store/reducers/user';
import { fetchUsers } from './store/actions/user';

enableScreens();

//založení root reduceru, který spojuje všechny reducery do jednoho
const rootReducer = combineReducers({
  records: recordsReducer,
  comodities: comoditiesReducer,
  auth: authReducer,
  users: usersReducer,
});

//založení store, ve kterém jsou uloženy redux hodnoty
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

//načtení fotnů aplikace
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });
};

//Spuštění aplikace
export default function App() {
  //Ignorování upozornění pro platfromu Android s dlouhým nastavením života tokenu
  LogBox.ignoreLogs(['Setting a timer']);
  LogBox.ignoreLogs([`Can't perform a React`]);

  //state držící stav načtení fontů
  const [fontLoaded, setFontLoaded] = useState(false);

  //načtení uživatelských dat
  store.dispatch(fetchUsers());

  //Aplikace se nenačte před načtením fontu
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }

  //Načtení navigace aplikace
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
