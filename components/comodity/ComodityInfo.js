import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

import Colors from '../../styles/Colors';
import { useSelector } from 'react-redux';

//komponent Comodity info
const ComodityInfo = (props) => {

  //zjistí vlastníka nemovitosti
  const comodityWarden = useSelector((state) =>
    state.users.users.find(
      (user) => user.authId === props.selectedComodity.wardenId
    )
  );

  //zjistí nájemníka namovitosti
  const comodityTenant = useSelector((state) =>
    state.users.users.find(
      (user) => user.authId === props.selectedComodity.tenantId
    )
  );

  //dnešní datum
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = dd + '.' + mm + '.' + yyyy;

  //tělo komponentu
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.date}>
          <Text style={styles.headerText}>Today is </Text>
          <Text style={styles.headerText}>{today}</Text>
        </View>

        <View style={styles.ComodityInfo}>
          <View style={styles.TextData}>
            <Text style={styles.Label}>Realty name: </Text>
            <Text style={styles.Data}>{props.selectedComodity.name}</Text>
          </View>
          <View style={styles.TextData}>
            <Text style={styles.Label}>Address: </Text>
            <Text style={styles.Data}>{props.selectedComodity.address}</Text>
          </View>
          <View style={styles.TextData}>
            <Text style={styles.Label}>Key: </Text>
            <Text style={styles.Data}>{props.selectedComodity.id}</Text>
          </View>
          <View style={styles.TextData}>
            <Text style={styles.Label}>Currency: </Text>
            <Text style={styles.Data}>{props.selectedComodity.currency}</Text>
          </View>
        </View>
        <View style={styles.peopleContainer}>
          <View>
            <View style={styles.PeopleHeader}>
              <Text style={styles.headerText}>Warden</Text>
            </View>
            <View style={styles.PeopleData}>
              {comodityWarden ? (
                <View>
                  <View style={styles.TextData}>
                    <Text style={styles.Label}>Name: </Text>
                    <Text style={styles.Data}>
                      {comodityWarden ? comodityWarden.name : ''}
                    </Text>
                  </View>

                  <View style={styles.TextData}>
                    <Text style={styles.Label}>Email: </Text>
                    <Text
                      onPress={() =>
                        Linking.openURL(`mailto:${comodityWarden.email}`)
                      }
                      style={styles.Data}
                    >
                      {comodityWarden ? comodityWarden.email : ''}
                    </Text>
                  </View>

                  <View style={styles.TextData}>
                    <Text style={styles.Label}>Phone: </Text>
                    <Text
                      onPress={() => {
                        Linking.openURL(`tel:${comodityWarden.phone}`);
                      }}
                      style={styles.Data}
                    >
                      {comodityWarden ? comodityWarden.phone : ''}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.NoData}>
                  <Text style={styles.Data}>No data</Text>
                </View>
              )}
            </View>
          </View>
          <View>
            <View style={styles.PeopleHeader}>
              <Text style={styles.headerText}>Tenant</Text>
            </View>
            <View style={styles.PeopleData}>
              {comodityTenant ? (
                <View>
                  <View style={styles.TextData}>
                    <Text style={styles.Label}>Name: </Text>
                    <Text style={styles.Data}>
                      {comodityTenant ? comodityTenant.name : ''}
                    </Text>
                  </View>

                  <View style={styles.TextData}>
                    <Text style={styles.Label}>Email: </Text>
                    <Text
                      onPress={() =>
                        Linking.openURL(`mailto:${comodityTenant.email}`)
                      }
                      style={styles.Data}
                    >
                      {comodityTenant ? comodityTenant.email : ''}
                    </Text>
                  </View>

                  <View style={styles.TextData}>
                    <Text style={styles.Label}>Phone: </Text>
                    <Text
                      onPress={() => {
                        Linking.openURL(`tel:${comodityTenant.phone}`);
                      }}
                      style={styles.Data}
                    >
                      {comodityTenant ? comodityTenant.phone : ''}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.NoData}>
                  <Text style={styles.Data}>No data</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.Summary}>
          <View style={styles.TextData}>
            <Text style={styles.Label}>Number of your records: </Text>
            <Text style={styles.Data}>{props.records.length}</Text>
          </View>
          <View style={styles.TextData}>
            <Text style={styles.Label}>Total costs: </Text>
            <Text style={styles.Data}>
              {props.spent} {props.selectedComodity.currency},-
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
    justifyContent: 'flex-start',
  },
  date: {
    backgroundColor: Colors.primaryColor,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    color: Colors.white,
    fontSize: 16,
  },
  TextData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Label: { fontWeight: 'bold', fontSize: 15 },
  Data: { fontSize: 15 },
  ComodityInfo: {
    marginVertical: 20,
  },
  peopleContainer: {
    flexDirection: 'column',
    width: '95%',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    borderRadius: 20,
  },
  PeopleHeader: {
    backgroundColor: Colors.primaryColor,
    width: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
  },
  PeopleData: { marginVertical: 10, paddingHorizontal: 54 },
  Summary: { marginVertical: 40 },
  NoData: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default ComodityInfo;
