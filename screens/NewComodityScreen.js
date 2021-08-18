import React, { useCallback, useReducer, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Text,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/UI/Input';
import * as comoditiesActions from '../store/actions/comodities';
import CButton from '../components/UI/CustomButton';
import Colors from '../styles/Colors';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';

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

//stránka NewComodityScreen - přidat nemovitost
const NewComodityScreen = (props) => {
  const dispatch = useDispatch();
  
  //state
  const comodityId = props.route.params ? props.route.params.comodityId : null;
  const editedComodity = useSelector((state) =>
    state.comodities.tenantCom.find((comodity) => comodity.id === comodityId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedComodity ? editedComodity.name : '',
      address: editedComodity ? editedComodity.address : '',
      description: editedComodity ? editedComodity.description : '',
    },
    inputValidities: {
      name: editedComodity ? true : false,
      address: editedComodity ? true : false,
      description: editedComodity ? true : false,
    },
    formIsValid: editedComodity ? true : false,
  });

  const [currency, setCurrency] = useState('Czk');

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


  //přidat
  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form', [
        { text: 'Okey' },
      ]);
      return;
    }
    if (props.route.params.type === 'Warden') {
      dispatch(
        comoditiesActions.createWardenComodity(
          formState.inputValues.name,
          formState.inputValues.address,
          formState.inputValues.description,
          currency
        )
      );
    } else if (props.route.params.type === 'Tenant') {
      dispatch(
        comoditiesActions.createTenantComodity(
          formState.inputValues.name,
          formState.inputValues.address,
          formState.inputValues.description,
          currency
        )
      );
    }

    props.navigation.goBack();
  }, [dispatch, comodityId, formState, currency]);

  //tělo komponentu
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ScrollView style={{ marginTop: 30, width: '90%' }}>
        <Input
          id='name'
          icon='home'
          label='Realty name'
          placeholder='Entitle your realty'
          errorText='Please enter some name'
          onInputChange={inputChangeHandler}
          initialValue={''}
          required
        />
        <Input
          id='address'
          icon='map-pin'
          label='Address'
          placeholder='Where it can be found ?'
          errorText='Please eneter address of this realty'
          onInputChange={inputChangeHandler}
          required
        />
        <Input
          id='description'
          label='Description'
          icon='align-left'
          errorText='Enter any description'
          onInputChange={inputChangeHandler}
          multiline
          numberOfLines={3}
          initialValue={''}
          initiallyValid={true}
        />
        <Text
          style={{
            color: Colors.primaryColor,
            fontWeight: 'bold',
            marginTop: 30,
          }}
        >
          Currency
        </Text>
        <Feather
          name='dollar-sign'
          size={20}
          style={{ marginTop: 10, marginLeft: -3 }}
          color={Colors.primaryColor}
        />
        <Picker
          selectedValue={currency}
          onValueChange={(itemValue, itemIndex) => setCurrency(itemValue)}
          style={Platform.OS === 'ios' && { marginTop: -60 }}
        >
          {/* TODO: Dát do externího souboru a mapovat možnosti */}
          <Picker.Item label='CZK' value='Czk' />
          <Picker.Item label='EUR' value='€' />
          <Picker.Item label='PLN' value='zł' />
          <Picker.Item label='CHF' value='CHF' />
          <Picker.Item label='GBP' value='£' />
          <Picker.Item label='USD' value='$' />
        </Picker>
        <CButton
          text='Create'
          style='main'
          onPress={submitHandler}
          initialValue={''}
          initiallyValid={true}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = (navigationData) => {
  return {
    headerTitle: 'Create ' + navigationData.route.params.type + ' realty',
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: { margin: 20 },
});

export default NewComodityScreen;
