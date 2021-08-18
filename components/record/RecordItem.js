import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import moment from 'moment';
import Icon from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import categoryColor from '../../helpers/categoryColor';
import Colors from '../../styles/Colors';
import TouchableCmpSelector from '../../helpers/TouchableCmpSelector';


//komponent RecordItem
const RecordItem = (props) => {
  
  //deklarování TouchableCmp
  let TouchableCmp = TouchableCmpSelector();

  //tělo komponentu
  return (
    <View
      style={[
        styles.gridItem,
        { backgroundColor: categoryColor(props.category.toLowerCase()) },
      ]}
    >
      <View style={styles.date}>
        <Text style={[styles.text, { textDecorationLine: 'underline' }]}>
          {moment(props.date).format('DD.MM.YYYY')}
        </Text>
      </View>
      <TouchableCmp style={styles.item} onPress={props.onSelect} useForeground>
        <View style={styles.item}>
          <View style={{ width: '15%' }}>
            <Text style={styles.text}>{props.name}</Text>
          </View>

          <View style={{ width: '30%', paddingLeft: 28 }}>
            <Text style={styles.text}>
              {props.category[0].toUpperCase() + props.category.substring(1)}
            </Text>
          </View>

          <View
            style={{ width: '20%', alignItems: 'flex-end', marginRight: 10 }}
          >
            <Text style={styles.text}>
              {props.priceType}
              {props.price} {props.currency}
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              flexDirection: 'column',
              alignItems: 'center',
              marginRight: 5,
            }}
          >
            {props.shared !== 'no' ? (
              <FontAwesome
                name='link'
                size={20}
                color={Colors.white}
                style={{ marginBottom: 4 }}
              />
            ) : null}
            {props.shareStatus === 'pending' ? (
              <FontAwesome
                name='hourglass-start'
                size={15}
                color={Colors.white}
              />
            ) : null}
            {props.shareStatus === 'accepted' ? (
              <FontAwesome name='check-square' size={15} color={Colors.white} />
            ) : null}
            {props.shareStatus === 'declined' ? (
              <FontAwesome name='ban' size={15} color={Colors.white} />
            ) : null}
          </View>
          <View style={{ width: '10%' }}>
            <Icon
              onPress={props.onDelete}
              name='md-close-circle'
              size={20}
              color={Colors.white}
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
    margin: 5,
    paddingBottom: 20,
    paddingTop: 5,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  text: { color: Colors.white, fontWeight: 'bold' },
  date: {
    marginBottom: 10,
  },
});

export default RecordItem;
