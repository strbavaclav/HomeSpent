import React, { useEffect, useCallback, useReducer } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../components/UI/HeaderButton';
import Input from '../components/UI/Input';
import Colors from '../styles/Colors';
import * as comoditiesActions from '../store/actions/comodities';

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

//stránka SettingsComodityScreen - nastavení nemovitosti
const SettingsComodityScreen = (props) => {
  const dispatch = useDispatch();


  //state
  const comodityId = props.route.params.comodityId;
  const editedComodity = useSelector((state) =>
    state.comodities.comodities.find((comodity) => comodity.id === comodityId)
  );
  const tenantIs = useSelector((state) =>
    state.users.users.find((user) => user.authId === editedComodity.tenantId)
  );

  const loggedUser = useSelector((state) => state.auth.userId);
  const wardenId = editedComodity.wardenId;

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedComodity ? editedComodity.name : '',
      address: editedComodity ? editedComodity.address : '',
      description: editedComodity ? editedComodity.description : '',
      tenantId: editedComodity ? editedComodity.tenantId : '',
    },
    inputValidities: {
      name: editedComodity ? true : false,
      address: editedComodity ? true : false,
      description: editedComodity ? true : false,
      tenantId: editedComodity ? true : false,
    },
    formIsValid: editedComodity ? true : false,
  });

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

    if (wardenId === loggedUser) {
      dispatch(
        comoditiesActions.updateWardenComodity(
          comodityId,
          formState.inputValues.name,
          formState.inputValues.address,
          formState.inputValues.description,
          formState.inputValues.tenantId
        )
      );
    } else {
      dispatch(
        comoditiesActions.updateTenantComodity(
          comodityId,
          formState.inputValues.name,
          formState.inputValues.address,
          formState.inputValues.description
        )
      );
    }

    props.navigation.goBack();
  }, [dispatch, editedComodity, formState]);

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
          icon='home'
          label='Name'
          errorText='Please eneter valid realty name!'
          onInputChange={inputChangeHandler}
          initialValue={editedComodity.name}
          initiallyValid={false}
          required
        />
        <Input
          id='address'
          icon='map'
          label='Address'
          errorText='Please eneter valid address!'
          onInputChange={inputChangeHandler}
          initialValue={editedComodity.address}
          initiallyValid={false}
          required
        />
        <Input
          id='description'
          icon='align-left'
          label='Description'
          errorText='Please eneter some description!'
          onInputChange={inputChangeHandler}
          initialValue={editedComodity.description}
          initiallyValid={true}
        />
        {loggedUser === wardenId ? (
          <View>
            <Input
              id='tenantId'
              icon='user'
              label='Tenant ID'
              errorText='Please eneter some description!'
              onInputChange={inputChangeHandler}
              initialValue={editedComodity.tenantId}
              initiallyValid={true}
            />
            <View style={{ marginVertical: 5 }}>
              <Text
                style={{
                  color: Colors.primaryColor,
                  fontWeight: 'bold',
                  marginBottom: 5,
                }}
              >
                {' '}
                Tenant name
              </Text>
              <Text style={{ marginLeft: 4 }}>
                {tenantIs ? tenantIs.name : null}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export const screenOptions = (navigationData) => {
  return {
    headerTitle: 'Set Comodity',
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formControl: {
    width: '100%',
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

export default SettingsComodityScreen;
