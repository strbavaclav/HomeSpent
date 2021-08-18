import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Clipboard from 'expo-clipboard';
import { Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from '../../styles/Colors';


//import akcí autentifikace a uživatele
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';



//Obsah šuplíkového menu
const DrawerContent = (props) => {
  const dispatch = useDispatch();

  //identifikace přihlášeného uživatele
  const users = useSelector((state) => state.users.users);
  const auth = useSelector((state) => state.auth.userId);
  const signedUser = users.find((user) => user.authId === auth);

  //výpočet připojených nemovitostí k uživateli
  const tComodities = useSelector((state) => state.comodities.tenantCom).length;
  const wComodities = useSelector((state) => state.comodities.wardenCom).length;
  const controlledComodities = tComodities + wComodities;

  //načtení dat o uživatelích
  useEffect(() => {
    dispatch(userActions.fetchUsers());
  }, [dispatch]);


  //Obsah
  return (
    <View style={styles.drawerContent}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Avatar.Image
                source={require('../../assets/images/user-image.png')}
                size={50}
              />
              <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                <Title style={styles.title}>
                  {signedUser ? signedUser.name : ''}
                </Title>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => {
                    Clipboard.setString(signedUser.id);
                    Alert.alert('Copied', 'Now you can share your user ID', [
                      { text: 'Ok' },
                    ]);
                  }}
                >
                  <MaterialIcons name='content-copy' size={16} color={Colors.primaryColor} />
                  <Caption
                    style={[styles.caption, {color:Colors.primaryColor, lineHeight: 20, marginLeft: 5 }]}
                  >
                    copy your ID
                  </Caption>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.section}>
                <Caption style={styles.caption}>You are managing:</Caption>
                <Paragraph
                  style={[styles.paragraph, styles.caption, { marginLeft: 10 }]}
                >
                  {controlledComodities} realties
                </Paragraph>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='home-outline' color={Colors.primaryColor} size={size} />
              )}
              label='My Realties'
              onPress={() => {
                props.navigation.navigate('Comodities');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='settings-outline' color={Colors.primaryColor} size={size} />
              )}
              label='Settings'
              onPress={() => {
                props.navigation.navigate('Settings');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name='information-outline' color={Colors.primaryColor} size={size} />
              )}
              label='About App'
              onPress={() => {
                props.navigation.navigate('About');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name='exit-to-app' color={color} size={size} />
          )}
          label='sign out'
          onPress={() => {
            dispatch(authActions.logout());
          }}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;
