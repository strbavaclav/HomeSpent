import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as recordsActions from '../../store/actions/records';
import Input from '../../components/UI/Input';
import Colors from '../../styles/Colors';
import CButton from '../../components/UI/CustomButton';

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

const EditRecordScreen = (props) => {
  const dispatch = useDispatch();

  const recordId = props.route.params.recordId;
  const comodityId = props.route.params.comodityId;
  const editedRecord = useSelector((state) =>
    state.records.records.find((rec) => rec.id === recordId)
  );

  const loggedUser = useSelector((state) => state.auth.userId);

  const ParentComodity = useSelector((state) =>
    state.comodities.comodities.find((com) => com.id === comodityId)
  );

  const isUserWarden = () => {
    if (ParentComodity.wardenId === loggedUser) {
      return true;
    } else {
      return false;
    }
  };

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedRecord ? editedRecord.name : '',
      price: editedRecord ? editedRecord.price : '',
      note: editedRecord ? editedRecord.note : '',
    },
    inputValidities: {
      name: editedRecord ? true : false,
      price: editedRecord ? true : false,
      note: true,
    },
    formIsValid: editedRecord ? true : false,
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

  const [showDate, setShowDate] = useState(false);
  const [category, setCategory] = useState(
    editedRecord ? editedRecord.category : 'electricity'
  );

  const prepareSharing = (option) => {
    if (loggedUser === ParentComodity.tenantId) {
      if (option === 'yes') {
        return ParentComodity.wardenId;
      } else {
        return 'no';
      }
    } else {
      if (option === 'yes') {
        return ParentComodity.tenantId;
      } else {
        return 'no';
      }
    }
  };

  const [share, setShare] = useState(
    editedRecord ? (editedRecord.sharedWith !== 'no' ? 'yes' : 'no') : 'no'
  );
  const [shareOutput, setShareOutput] = useState('');

  const [shareStatus, setShareStatus] = useState(
    editedRecord ? editedRecord.shareStatus : ''
  );

  const [date, setDate] = useState(
    editedRecord ? new Date(editedRecord.date) : new Date()
  );
  const [priceType, setPriceType] = useState(
    editedRecord ? editedRecord.priceType : '-'
  );

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(currentDate);
  };

  const priceTypeHandler = (type) => {
    if (type === '+') {
      setPriceType('+');
    } else if (type === '-') {
      setPriceType('-');
    }
  };

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form', [
        { text: 'Okey' },
      ]);
      return;
    }

    if (editedRecord) {
      dispatch(
        recordsActions.updateRecord(
          editedRecord.id,
          formState.inputValues.name,
          loggedUser,
          date,
          formState.inputValues.note,
          category,
          formState.inputValues.price,
          priceType,
          prepareSharing(shareOutput),
          shareStatus
        )
      );
    } else {
      dispatch(
        recordsActions.createRecord(
          comodityId,
          formState.inputValues.name,
          loggedUser,
          date,
          formState.inputValues.note,
          category,
          formState.inputValues.price,
          priceType,
          prepareSharing(share),
          prepareSharing(share) === 'yes' ? shareStatus : ''
        )
      );
    }
    props.navigation.goBack();
  }, [
    formState,
    dispatch,
    recordId,
    comodityId,
    date,
    category,
    priceType,
    loggedUser,
    share,
    shareStatus,
  ]);

  const identifyAutor = (editedRecord) => {
    if (editedRecord !== undefined) {
      let editorId = editedRecord.userId;
      let editorNameTest = useSelector((state) =>
        state.users.users.find((user) => user.authId === editorId)
      );
      if (editorNameTest !== undefined) {
        return editorNameTest.name;
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id='name'
            icon='tag'
            label='Caption'
            placeholder='What do you want to record ?'
            errorText='Please eneter valid realty name!'
            onInputChange={inputChangeHandler}
            initialValue={editedRecord ? editedRecord.name : ''}
            initiallyValid={false}
            required
          />

          <View style={styles.formControl}>
            <Text
              style={{
                color: Colors.primaryColor,
                fontWeight: 'bold',
                marginTop: 20,
              }}
            >
              Category
            </Text>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
              style={Platform.OS === 'ios' && { marginTop: -50 }}
            >
              {/* TODO: Dát do externího souboru a mapovat možnosti */}
              <Picker.Item label='Electricity' value='electricity' />
              <Picker.Item label='Water' value='water' />
              <Picker.Item label='Gas' value='gas' />
              <Picker.Item label='Garbage' value='garbage' />
              <Picker.Item label='Rent' value='rent' />
              <Picker.Item label='Insurence' value='insurence' />
              <Picker.Item label='Television + Radio' value='TV+' />
              <Picker.Item label='Internet' value='internet' />
              <Picker.Item label='Equipment' value='equipment' />
              <Picker.Item label='Repairs' value='repairs' />
              <Picker.Item label='Services' value='services' />
              <Picker.Item label='Others' value='others' />
            </Picker>
          </View>

          <Text
            style={{
              color: Colors.primaryColor,
              fontWeight: 'bold',
              marginTop: 20,
            }}
          ></Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            {isUserWarden() ? (
              <CButton
                onPress={() => {
                  priceTypeHandler('+');
                }}
                text='+ | Income'
                style={priceType === '+' ? 'main' : 'outline'}
              />
            ) : null}

            <CButton
              onPress={() => {
                priceTypeHandler('-');
              }}
              text='- | Expense'
              style={priceType === '+' ? 'outline' : 'main'}
            />
          </View>

          <Input
            id='price'
            icon='bar-chart-2'
            label={`Price | ${priceType} ${ParentComodity.currency}`}
            placeholder='How much ?'
            errorText='Please eneter price of record!'
            onInputChange={inputChangeHandler}
            keyboardType='numeric'
            initialValue={editedRecord ? editedRecord.price : ''}
            initiallyValid={false}
            required
          />

          <View>
            <Text
              style={{
                color: Colors.primaryColor,
                fontWeight: 'bold',
                marginVertical: 5,
              }}
            >
              Date
            </Text>

            {Platform.OS === 'android' ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 9,
                    borderWidth: 2,
                    borderColor: Colors.primaryColor,
                    borderRadius: 10,
                    padding: 10,
                    paddingTop: 12,
                  }}
                >
                  {moment(date).format('DD.MM.YYYY').toString()}
                </Text>
                <CButton
                  text='Change date'
                  style='main'
                  onPress={() => setShowDate(true)}
                />
                {showDate && (
                  <DateTimePicker
                    minimumDate={new Date(2000, 0, 1)}
                    value={date}
                    mode='date'
                    display='default'
                    onChange={onDateChange}
                    dateFormat='day month year'
                  />
                )}
              </View>
            ) : (
              <DateTimePicker
                minimumDate={new Date(2000, 0, 1)}
                value={date}
                mode='date'
                display='default'
                onChange={onDateChange}
                dateFormat='day month year'
              />
            )}
          </View>

          <Input
            id='note'
            icon='edit-3'
            label='Note'
            placeholder='Any additional description ?'
            errorText='Please eneter valid description!'
            onInputChange={inputChangeHandler}
            initialValue={editedRecord ? editedRecord.note : ''}
            initiallyValid={true}
          />

          {ParentComodity.wardenId !== '' && ParentComodity.tenantId !== '' && (
            <View>
              <Text
                style={{
                  color: Colors.primaryColor,
                  fontWeight: 'bold',
                  marginVertical: 5,
                }}
              >
                Share this record with other side ?
              </Text>
              <Picker
                selectedValue={share}
                onValueChange={(itemValue, itemIndex) => {
                  setShare(itemValue);
                  setShareOutput(itemValue);
                }}
                style={
                  Platform.OS === 'ios' && { marginTop: -50, marginBottom: -30 }
                }
              >
                <Picker.Item label='No' value='no' />
                <Picker.Item label='Yes' value='yes' />
              </Picker>
              {share === 'yes' && (
                <View>
                  <Text
                    style={{
                      color: Colors.primaryColor,
                      fontWeight: 'bold',
                      marginVertical: 5,
                    }}
                  >
                    Status of share request
                  </Text>
                  <Picker
                    selectedValue={shareStatus}
                    onValueChange={(itemValue, itemIndex) =>
                      setShareStatus(itemValue)
                    }
                    style={Platform.OS === 'ios' && { marginTop: -50 }}
                  >
                    <Picker.Item label='Pending' value='pending' />
                    <Picker.Item label='Accepted' value='accepted' />
                    <Picker.Item label='Declided' value='declined' />
                  </Picker>
                </View>
              )}
            </View>
          )}

          <Text
            style={{
              color: Colors.primaryColor,
              fontWeight: 'bold',
              marginVertical: 5,
            }}
          >
            {editedRecord ? 'Written by' : null}
          </Text>

          {editedRecord ? <Text>{identifyAutor(editedRecord)}</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.recordId ? 'Edit record' : 'New record',
  };
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    margin: 20,
  },
  formControl: { width: '100%' },
  label: { marginVertical: 8 },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default EditRecordScreen;
