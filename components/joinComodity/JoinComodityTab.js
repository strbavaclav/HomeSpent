import React, { useState, useCallback } from 'react';
import { View, Modal, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import CButton from '../UI/CustomButton';
import Colors from '../../styles/Colors';

//import akcí pro nemovitosti
import * as comodityActions from '../../store/actions/comodities';

const JoinComodityTab = (props) => {
  const dispatch = useDispatch();

  //state viditelnosti modalu a vloženého ID nemovitosti
  const [modalVisible, setModalVisible] = useState(false);
  const [comodityId, setComodityId] = useState('');

  //ukazatel na redux state nemovitostí
  const comodities = useSelector((state) => state.comodities.comodities);

  //funkce pro vyhledání nemovitosti podle klíče
  function searchComodity(id, coms) {
    for (var i = 0; i < coms.length; i++) {
      if (coms[i].id === id) {
        return coms[i];
      }
    }
  }

  //funkce připojit k nemovitosti
  const submitHandler = useCallback(() => {
    //prohledá seznam nemovitostí
    var foundComodity = searchComodity(comodityId, comodities);
    //když nemovitost existuje
    if (foundComodity !== undefined) {
      //když je uživatel správce
      if (props.type === 'Warden') {
        //ověření obsazenosti správcovské pozice
        if (foundComodity.wardenId === '') {
          dispatch(comodityActions.JoinWardenComodity(foundComodity.id));
          Alert.alert('Realty successfully added to your list!');
          setModalVisible(!modalVisible);
        } else {
          Alert.alert('The realty already has warden!');
        }
      } else {
        if (foundComodity.tenantId == '') {
          dispatch(comodityActions.JoinTenantComodity(foundComodity.id));
          Alert.alert('Realty successfully added to your list!');
          setModalVisible(!modalVisible);
        } else {
          Alert.alert('The realty is already Tenant by someone!');
        }
      }
      setComodityId('');
    } else {
      Alert.alert('Realty with this ID does not exist!');
    }
  }, [dispatch, comodityId, modalVisible]);

  //tělo komponentu
  return (
    <View style={styles.container}>
      <View style={styles.joinTile}>
        <View style={styles.joinTileContainer}>
          <Text style={styles.JoinTileText}>
            Do you want to join already existing realty as {props.type}?
          </Text>
        </View>
        <View style={styles.JoinTileBtnContainer}>
          <CButton
            text='Join'
            style='main'
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.form}>
              <Text style={styles.textConnection}>
                New {props.type.toLowerCase()} connection
              </Text>
              <Text style={styles.modalText}>
                Ask realty holder for the ID of the realty. It can be found in
                realty detail under{' '}
                <MaterialIcons name='content-copy' size={15} color='black' />
              </Text>
              <View style={styles.controller}>
                <Feather name='hash' color={Colors.primaryColor} size={20} />

                <TextInput
                  style={styles.input}
                  value={comodityId}
                  onChangeText={(text) => setComodityId(text)}
                />
              </View>
              <CButton
                text='Join'
                style='main'
                initialValue={''}
                initiallyValid={true}
                onPress={() => submitHandler()}
              />
              <CButton
                text='Close'
                style='outline'
                onPress={() => setModalVisible(!modalVisible)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  centeredView: {
    flex: 1,
    position: 'absolute',
    top: 120,
    left: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalView: {
    width: '95%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  controller: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryColor,
    paddingBottom: 5,
  },
  textConnection: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.primaryColor,
    fontWeight: 'bold',
  },

  joinTile: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20,
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 80,
    zIndex: 100,
  },
  textStyle: {
    color: Colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  formControl: {
    width: '100%',
  },
  label: { fontFamily: 'open-sans-bold', marginVertical: 8 },
  input: {
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 0 : -12,
    paddingLeft: 10,
  },
  form: { margin: 20 },
  joinTileContainer: { maxWidth: '65%' },
  JoinTileText: { textAlign: 'center' },
  JoinTileBtnContainer: { marginBottom: 10 },
});

export default JoinComodityTab;
