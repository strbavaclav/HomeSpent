import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Button,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import ComodityItem from '../../components/comodity/ComodityItem';
import JoinComodityTab from '../../components/joinComodity/JoinComodityTab';
import * as comodityActions from '../../store/actions/comodities';
import Colors from '../../styles/Colors';
import NoComodities from '../../components/UI/NoComodities';

//stránka WardenScreen - vlastník
const WardenScreen = (props) => {
  const dispatch = useDispatch();

  //state
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //načtení nemovitostí
  const loadComodities = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(comodityActions.fetchComodities());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadComodities);

    return () => {
      unsubscribe();
    };
  }, [loadComodities]);

  useEffect(() => {
    setIsLoading(true);
    loadComodities().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadComodities]);

  //smazat nemovitost
  const deleteHandler = (id) => {
    Alert.alert(
      'Are you sure?',
      'Do you really want to delete this realty? All data will be lost!',
      [
        { text: 'No', style: 'default' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(comodityActions.deleteComodity(id));
            loadComodities();
          },
        },
      ]
    );
  };

  //odpojit nemovitost
  const dissboundHandler = (id) => {
    Alert.alert(
      'Are you sure?',
      'Do you really want to leave this realty? You will not be longer able manage it!',
      [
        { text: 'No', style: 'default' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(comodityActions.DissboundWardenComodity(id));
            loadComodities();
          },
        },
      ]
    );
  };

  //nemovitosti
  const renderComodities = (itemdata) => {
    return (
      <ComodityItem
        name={itemdata.item.name}
        color={itemdata.item.description}
        address={itemdata.item.address}
        wardenId={itemdata.item.wardenId}
        onSelect={() => {
          props.navigation.navigate('ComodityDetail', {
            comodityId: itemdata.item.id,
            comodityName: itemdata.item.name,
          });
        }}
        onDelete={() => deleteHandler(itemdata.item.id)}
        onDisconnect={() => dissboundHandler(itemdata.item.id)}
      />
    );
  };

  const comodities = useSelector((state) => state.comodities.wardenCom);

  if (error) {
    return (
      <View style={styles.screen}>
        <Text>An error occured!</Text>
        <Button
          title='Try again'
          onPress={loadComodities}
          color={Colors.primaryColor}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size='large' color={Colors.primaryColor} />
      </View>
    );
  }

  if (!isLoading && comodities.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <Text
            style={{
              color: Colors.primaryColor,
              fontSize: 20,
              textAlign: 'center',
            }}
          >
            Here you can add owned realties
          </Text>
        </View>
        <NoComodities />
        <JoinComodityTab type='Warden' />
      </View>
    );
  }

  //tělo komponentu
  return (
    <View style={{ flex: 1, marginBottom: 80 }}>
      <View style={{ margin: 20 }}>
        <Text
          style={{
            color: Colors.primaryColor,
            fontSize: 20,
            textAlign: 'center',
          }}
        >
          Here you can add all you own
        </Text>
      </View>

      <View style={{ marginBottom: 90 }}>
        <FlatList
          onRefresh={loadComodities}
          refreshing={isRefreshing}
          data={comodities}
          renderItem={renderComodities}
          numColumns={1}
        />
      </View>
      <JoinComodityTab type='Warden' />
    </View>
  );
};

export const screenOptions = (navigationData) => {
  return {
    headerTitle: 'In your service',
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title='Menu'
            iconName='ios-menu'
            onPress={() => {
              navigationData.navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      );
    },
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title='Add new'
            iconName='ios-add-circle'
            onPress={() => {
              navigationData.navigation.navigate('CreateComodity', {
                type: 'Warden',
              });
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
  noComs: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 150,
  },
  infoText: {
    color: 'grey',
    fontSize: 20,
    marginVertical: 3,
    marginHorizontal: 25,
    textAlign: 'center',
  },
});

export default WardenScreen;
