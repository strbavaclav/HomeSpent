import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

import HeaderButton from '../components/UI/HeaderButton';
import Input from '../components/UI/Input';
import * as userActions from '../store/actions/user';
import Colors from '../styles/Colors';

const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updateValidities) {
      updatedFormIsValid = updatedFormIsValid && updateValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

//stránka SettingsScreen - nastavení
const SettingsScreen = (props) => {
  const dispatch = useDispatch();

  //state
  const users = useSelector((state) => state.users.users);
  const auth = useSelector((state) => state.auth.userId);
  const signedUser = users.find((user) => user.authId === auth);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: signedUser ? signedUser.name : '',
      phone: signedUser ? signedUser.phone : '',
      country: signedUser ? signedUser.country : '',
      email: signedUser ? signedUser.email : '',
    },
    inputValidities: {
      name: signedUser ? true : false,
      phone: signedUser ? true : false,
      country: signedUser ? true : false,
      email: signedUser ? true : false,
    },
    formIsValid: signedUser ? true : false,
  });

  const [tabs, setTabs] = useState(signedUser ? signedUser.tabs : 2);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  //potvrzení
  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form', [
        { text: 'Okey' },
      ]);
      return;
    }

    dispatch(
      userActions.updateUser(
        signedUser.id,
        formState.inputValues.name,
        formState.inputValues.phone,
        formState.inputValues.country,
        tabs
      )
    );
    Alert.alert('Great!', 'Your changes has been saved successfully', [
      { text: 'Okey' },
    ]);
  }, [dispatch, signedUser, tabs, formState]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Save' iconName='ios-save' onPress={submitHandler} />
          </HeaderButtons>
        );
      },
    });
  }, [submitHandler]);


  //tělo komponentu
  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          id='name'
          icon='user'
          label='Name'
          errorText='Please eneter valid name!'
          onInputChange={inputChangeHandler}
          initialValue={signedUser.name}
          initiallyValid={true}
          required
        />
        <View style={{ margin: 10 }}>
          <Text style={{ color: 'red' }}>{signedUser.email}</Text>
          <Text style={{ color: 'red', fontSize: 12 }}>
            - your email can't be changed due to authentication
          </Text>
        </View>

        <Input
          id='phone'
          icon='phone'
          label='Phone'
          errorText='Please eneter valid phone number!'
          keyboardType='numeric'
          minLength={9}
          onInputChange={inputChangeHandler}
          initialValue={signedUser.phone}
          initiallyValid={true}
          required
        />
        <Input
          id='country'
          icon='map'
          label='Country'
          errorText='Please eneter existing country!'
          onInputChange={inputChangeHandler}
          initialValue={signedUser.country}
          initiallyValid={true}
          required
        />
      </View>
      <Text
        style={{
          color: Colors.primaryColor,
          fontWeight: 'bold',
          marginVertical: 5,
          marginHorizontal: 20,
        }}
      >
        What realty you want to manage ?
      </Text>
      <Picker
        selectedValue={tabs}
        onValueChange={(itemValue, itemIndex) => setTabs(itemValue)}
        style={Platform.OS === 'ios' && { marginTop: -40 }}
      >
        <Picker.Item label='Just Tenant' value={0} />
        <Picker.Item label='Just Warden' value={1} />
        <Picker.Item label='Tenan & Warden' value={2} />
      </Picker>

      <View>
        <Text
          style={{
            fontSize: 15,
            textAlign: 'center',
            margin: 20,
            marginTop: 40,
            color: 'grey',
          }}
        >
          If you are done with changes you can save it in the rigt top corner :)
        </Text>
      </View>
    </ScrollView>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: 'User settings',
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title='Menu'
            iconName='ios-menu'
            onPress={() => {
              navData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      );
    },
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: 40,
  },
  label: { fontFamily: 'open-sans-bold', marginVertical: 8 },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  form: { margin: 20 },
});

export default SettingsScreen;
