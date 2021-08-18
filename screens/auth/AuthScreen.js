import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import CButton from '../../components/UI/CustomButton';
import Colors from '../../styles/Colors';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';

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

//stránka AuthScreen
const AuthScreen = (props) => {

  //state
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      currency: '',
      country: '',
    },
    inputValidities: {
      email: false,
      password: false,
      name: false,
      phone: false,
      currency: false,
      country: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured!', error, [{ text: 'Okay' }]);
    }
  }, [error]);


  //vytvoření nového uživatele
  const createNewUser = (isSignUp) => {
    if (isSignUp) {
      dispatch(
        userActions.createUser(
          formState.inputValues.email,
          formState.inputValues.name,
          formState.inputValues.phone,
          formState.inputValues.country,
          2
        )
      );
    }
    dispatch(userActions.fetchUsers());
  };

  //přihlášení uživatele
  const authHandler = async () => {
    let action;
    if (isSignUp) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.signin(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      await createNewUser(isSignUp);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  //změna input polí
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

  //tělo komponentu
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ScrollView style={styles.authContainer}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{
              width: 200,
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: -25,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              color: Colors.primaryColor,
              marginBottom: 20,
            }}
          >
            Manage your realties
          </Text>
        </View>
        <Input
          id='email'
          icon='user'
          label='Email'
          placeholder='your email'
          keyboardType='email-address'
          required
          email
          autoCapitalize='none'
          errorText='Please enter your email'
          onInputChange={inputChangeHandler}
          initialValue=''
        />
        <Input
          id='password'
          icon='lock'
          label='Password'
          placeholder='your password'
          keyboardType='default'
          secureTextEntry
          password
          required
          minLength={5}
          autoCapitalize='none'
          errorText='Please enter valid password! It must contains at least min 5 characters, lowercase, uppercase, digit and special character (!,@,#,$,%,^,&,*)'
          onInputChange={inputChangeHandler}
          initialValue=''
        />
        {isSignUp ? (
          <>
            <Input
              id='name'
              icon='info'
              label='Full Name'
              placeholder='Your name'
              keyboardType='default'
              required
              minLength={3}
              autoCapitalize='none'
              errorText='Please enter your real name'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
            <Input
              id='phone'
              icon='phone'
              label='Phone'
              placeholder='your phone number'
              keyboardType='numeric'
              minLength={9}
              autoCapitalize='none'
              errorText='Please enter valid phone number'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
            <Input
              id='country'
              icon='map'
              label='Country'
              placeholder='Where are you from'
              keyboardType='default'
              minLength={3}
              autoCapitalize='none'
              errorText='Please enter country name'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
          </>
        ) : (
          <></>
        )}

        <View style={{ marginBottom: 50 }}>
          <CButton
            text={isSignUp ? 'Sign up' : 'Login'}
            style='main'
            onPress={authHandler}
          />

          {isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 10 }}
              size='small'
              color={Colors.primaryColor}
            />
          ) : (
            <CButton
              text={`Switch to ${isSignUp ? 'Login' : 'Sign up'}`}
              style='outline'
              onPress={() => {
                setIsSignUp((prevState) => !prevState);
              }}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: 'Home$pent',
};

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  authContainer: { width: '100%', maxWidth: 400, padding: 20 },
  button: {
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default AuthScreen;
