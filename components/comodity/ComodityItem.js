import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';

import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import TouchableCmpSelector from '../../helpers/TouchableCmpSelector';

//komponent ComodityItem
const ComodityItem = (props) => {
  
  //deklarování TouchableCmp
  let TouchableCmp = TouchableCmpSelector()

  //zjistí přihlášeného uživatele
  const loggedUserId = useSelector((state) => state.auth.userId);

  //zobrazení tlačítka smazat nemovitost
  const showDeletButtonHandler = () => {
    if (props.wardenId === loggedUserId || props.wardenId === '') {
      return true;
    } else {
      return false;
    }
  };

  //tělo komponentu
  return (
    <View style={styles.gridItem}>
      <TouchableCmp style={styles.item} onPress={props.onSelect} useForeground>
        <View style={styles.container}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title} numberOfLines={2}>
              {props.name}
            </Text>
            <Text style={{ color: Colors.white }}>{props.address}</Text>
          </View>
          <View
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            {showDeletButtonHandler() && (
              <FontAwesome
                style={styles.deleteButton}
                name='trash'
                color={Colors.white}
                size={25}
                onPress={props.onDelete}
              />
            )}

            <AntDesign
              style={styles.deleteButton}
              name='disconnect'
              color={Colors.white}
              size={25}
              onPress={props.onDisconnect}
            />
          </View>
        </View>
      </TouchableCmp>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
    marginHorizontal: 5,
    marginVertical: 5,
    height: 100,
    elevation: 3,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    color: Colors.white,
  },

  item: {
    flex: 1,
  },
});

export default ComodityItem;
