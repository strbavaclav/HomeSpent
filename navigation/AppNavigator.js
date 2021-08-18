import React from 'react';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Colors from '../styles/Colors';

//import StackNavigátoru
import { createStackNavigator } from '@react-navigation/stack';

//import navigačního šuplíku
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';

//Import TabNavigátoru
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//import jednotlivých komponent pro navigační systém
import DetailComodityScreen, {
  screenOptions as DetailComodityScreenOptions,
} from '../screens/DetailComodityScreen';
import SettingsComodityScreen, {
  screenOptions as SettingsComodityScreenOptions,
} from '../screens/SettingsComodityScreen';
import TenantScreen, {
  screenOptions as TenantScreenOptions,
} from '../screens/comodities/TenantScreen';
import WardenScreen, {
  screenOptions as WardenScreenOptions,
} from '../screens/comodities/WardenScreen';
import SettingsScreen, {
  screenOptions as SettingsScreenOptions,
} from '../screens/SettingsScreen';
import NewComodityScreen, {
  screenOptions as NewComodityScreenOptions,
} from '../screens/NewComodityScreen';
import EditRecordScreen, {
  screenOptions as EditRecordScreenOptions,
} from '../screens/records/EditRecordScreen';
import AuthScreen, {
  screenOptions as AuthScreenOptions,
} from '../screens/auth/AuthScreen';
import AboutScreen, {
  screenOptions as AboutScreenOptions,
} from '../screens/AboutScreen';
import DrawerContent from '../components/UI/DrawerContent';

//deafultní nastavení StackNavigátoru
const defaultStackNavOptions = {
  headerBackTitle: 'Back',
  headerTintColor: 'black',
};

//StackNavigátor nájemníka
const TenantStackNavigator = createStackNavigator();
export const TenantNavigator = () => {
  return (
    <TenantStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
      <TenantStackNavigator.Screen
        name='TenantScreen'
        component={TenantScreen}
        options={TenantScreenOptions}
      />
      <TenantStackNavigator.Screen
        name='ComodityDetail'
        component={DetailComodityScreen}
        options={DetailComodityScreenOptions}
      />
      <TenantStackNavigator.Screen
        name='ComoditySettings'
        component={SettingsComodityScreen}
        options={SettingsComodityScreenOptions}
      />
      <TenantStackNavigator.Screen
        name='CreateComodity'
        component={NewComodityScreen}
        options={NewComodityScreenOptions}
      />
      <TenantStackNavigator.Screen
        name='EditRecord'
        component={EditRecordScreen}
        options={EditRecordScreenOptions}
      />
    </TenantStackNavigator.Navigator>
  );
};

//StackNavigátor vlastníka
const WardenStackNavigator = createStackNavigator();
export const WardenNavigator = () => {
  return (
    <WardenStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
      <WardenStackNavigator.Screen
        name='WardenScreen'
        component={WardenScreen}
        options={WardenScreenOptions}
      />
      <WardenStackNavigator.Screen
        name='ComodityDetail'
        component={DetailComodityScreen}
        options={DetailComodityScreenOptions}
      />
      <WardenStackNavigator.Screen
        name='ComoditySettings'
        component={SettingsComodityScreen}
        options={SettingsComodityScreenOptions}
      />
      <WardenStackNavigator.Screen
        name='CreateComodity'
        component={NewComodityScreen}
        options={NewComodityScreenOptions}
      />
      <WardenStackNavigator.Screen
        name='EditRecord'
        component={EditRecordScreen}
        options={EditRecordScreenOptions}
      />
    </WardenStackNavigator.Navigator>
  );
};

//TabNavigátor mezi nájemníkem a vlastníkem
const ComodityTypeTabNavigator = createBottomTabNavigator();

export const ComodityTypeNavigator = () => {
  const loggedUserId = useSelector((state) => state.auth.userId);
  const loggedUser = useSelector((state) =>
    state.users.users.find((user) => user.authId === loggedUserId)
  );

  //zobrazení záložek dle preferncí uživatele
  const FindUserTabs = (type) => {
    if (loggedUser) {
      if (type === 'tenant') {
        let check = loggedUser.tabs;
        if (check === 0 || check === 2) {
          return true;
        } else {
          return false;
        }
      } else if (type === 'warden') {
        let check = loggedUser.tabs;
        if (check === 1 || check === 2) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  };

  return (
    <ComodityTypeTabNavigator.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Tenant') {
            iconName = 'ios-home';
          } else if (route.name === 'Warden') {
            iconName = 'ios-build';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
        inactiveTintColor: Colors.gray,
      }}
    >
      {FindUserTabs('tenant') ? (
        <ComodityTypeTabNavigator.Screen
          name='Tenant'
          component={TenantNavigator}
          options={({ route }) => ({
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? '';

              if (
                routeName === 'ComodityDetail' ||
                routeName === 'CreateComodity' ||
                routeName === 'ComoditySettings' ||
                routeName === 'EditRecord'
              ) {
                return false;
              }

              return true;
            })(route),
          })}
        />
      ) : null}

      {FindUserTabs('warden') ? (
        <ComodityTypeTabNavigator.Screen
          name='Warden'
          component={WardenNavigator}
          options={({ route }) => ({
            tabBarVisible: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? '';

              if (
                routeName === 'ComodityDetail' ||
                routeName === 'CreateComodity' ||
                routeName === 'ComoditySettings' ||
                routeName === 'EditRecord'
              ) {
                return false;
              }

              return true;
            })(route),
          })}
        />
      ) : null}
    </ComodityTypeTabNavigator.Navigator>
  );
};

//StackNavigátor nastavení aplikace
const SettingsStackNavigator = createStackNavigator();
export const SettingsNavigator = () => {
  return (
    <SettingsStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
      <SettingsStackNavigator.Screen
        name='Settings'
        component={SettingsScreen}
        options={SettingsScreenOptions}
      />
    </SettingsStackNavigator.Navigator>
  );
};

//StackNavigátor O aplikaci
const AboutStackNavigator = createStackNavigator();
export const AboutNavigator = () => {
  return (
    <AboutStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
      <AboutStackNavigator.Screen
        name='About'
        component={AboutScreen}
        options={AboutScreenOptions}
      />
    </AboutStackNavigator.Navigator>
  );
};

//DrawerNavigátor šuplíku
const AppDrawerNavigator = createDrawerNavigator();
export const AppNavigator = () => {
  return (
    <AppDrawerNavigator.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: Colors.primaryColor,
      }}
    >
      <AppDrawerNavigator.Screen
        name='Comodities'
        component={ComodityTypeNavigator}
        options={{
          drawerIcon: (props) => <Ionicons name={'ios-home'} size={23} />,
        }}
      />
      <AppDrawerNavigator.Screen
        name='Settings'
        component={SettingsNavigator}
        options={{
          drawerIcon: (props) => <Ionicons name={'ios-create'} size={23} />,
        }}
      />
      <AppDrawerNavigator.Screen
        name='About'
        component={AboutNavigator}
        options={{
          drawerIcon: (props) => (
            <Ionicons name={'ios-information-circle'} size={23} />
          ),
        }}
      />
    </AppDrawerNavigator.Navigator>
  );
};

//StackNavigátor autentifikace
const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
      <AuthStackNavigator.Screen
        name='Auth'
        component={AuthScreen}
        options={AuthScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};
