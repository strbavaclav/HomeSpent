//tento soubor měl bý složen z více dceřiných souborů, autor však vzhledem k úrovni nedokázal včas zajistit funkční atomicitu některých částí.

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  Alert,
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Button,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Clipboard from 'expo-clipboard';

import EmptyComodityDetail from '../components/UI/EmptyComodityDetail';
import ComodityInfo from '../components/comodity/ComodityInfo';
import HeaderButton from '../components/UI/HeaderButton';
import FloatingButton from '../components/UI/FloatingButton';
import RecordItem from '../components/record/RecordItem';
import { VictoryLabel, VictoryPie } from 'victory-native';
import { SIZES } from '../styles/Theme';
import Colors from '../styles/Colors';

import * as recordActions from '../store/actions/records';
import categoryColor from '../helpers/categoryColor';
import NoDataView from '../components/UI/NoDataView';

//stránka DetailComodityScreen
const DetailComodityScreen = (props) => {
  const dispatch = useDispatch();
  //state
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const [selectedCategory, setSelectedCategory] = useState('garbage');
  const [showMode, setShowMode] = useState('chart');

  const [selected, setSelected] = useState('All');

  //načíst záznamy
  const loadRecords = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(recordActions.fetchRecords());
    } catch (err) {
      setError(err.message);
    }

    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadRecords);

    return () => {
      unsubscribe();
    };
  }, [loadRecords]);

  useEffect(() => {
    setIsLoading(true);
    loadRecords().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadRecords]);

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this record?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(recordActions.deleteRecord(id));
        },
      },
    ]);
  };

  //state
  const loggedUser = useSelector((state) => state.auth.userId);
  const comodityId = props.route.params.comodityId;
  const comoditiesList = useSelector((state) => state.comodities.comodities);
  const selectedComodity = comoditiesList.find((com) => com.id === comodityId);
  const records = useSelector((state) => state.records.records);
  const comodityRecords = records.filter(
    (record) => record.comodityId === selectedComodity.id
  );
  const MyRecords = comodityRecords.filter(
    (record) => record.userId === loggedUser
  );
  const SharedWithMeStatusRecords = comodityRecords.filter(
    (record) =>
      record.sharedWith === loggedUser && record.shareStatus === 'accepted'
  );

  const SharedWithMeRecords = comodityRecords.filter(
    (record) => record.sharedWith === loggedUser
  );

  const availableRecords = MyRecords.concat(SharedWithMeRecords);
  const SummaryRecords = MyRecords.concat(SharedWithMeStatusRecords);

  const editRecordHandler = (comodityId, recordId) => {
    props.navigation.navigate('EditRecord', {
      comodityId: comodityId,
      recordId: recordId,
    });
  };


  //vytvoření statistiky
  const CategorySummary = () => {
    const prepared = [];
    const allCategories = [];

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const recordsProcessed = () => {
      if (selected === 'Y') {
        let rec = SummaryRecords.filter(
          (record) => record.date.substring(0, 4) == year
        );
        return rec;
      } else if (selected === 'M') {
        let rec = SummaryRecords.filter(
          (record) => record.date.charAt(6) == month
        );
        return rec;
      } else {
        return SummaryRecords;
      }
    };

    let recordsProcessedNow = recordsProcessed();

    recordsProcessedNow.map((item) => {
      allCategories.push(item.category);
    });

    let uniqueCategories = allCategories.filter(
      (category, index) => allCategories.indexOf(category) === index
    );

    uniqueCategories.map((category) => {
      prepared.push({ x: category, y: null });
      const categoryMapped = prepared.findIndex((cat) => cat.x === category);
      SummaryRecords.map((record) => {
        if (record.category === category) {
          const oldY = prepared[categoryMapped].y;
          prepared[categoryMapped] = {
            x: category,
            y: oldY + Number(record.price),
          };
        }
      });
    });
    const total = prepareSpent(prepared);

    const CategoryData = prepared.map((category) => {
      let percentage = ((category.y / total) * 100).toFixed(0);
      return {
        x: category.x[0].toUpperCase() + category.x.substring(1),
        label: percentage + '%',
        y: category.y,
        percent: percentage,
        fill: categoryColor(category.x.toLowerCase()),
      };
    });

    return CategoryData;
  };

  const prepareSpent = (obj) => {
    var sum = 0;
    for (var el in obj) {
      if (obj.hasOwnProperty(el)) {
        sum += parseFloat(obj[el].y);
      }
    }
    return sum;
  };

  //záhlaví stránky
  const headerTile = () => {
    return (
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 15,
          backgroundColor: 'white',
        }}
      >
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FontAwesome name='home' size={30} color={Colors.primaryColor} />
            <Text style={{ fontSize: 28, marginLeft: 10 }}>
              {selectedComodity.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <MaterialIcons
              name='location-on'
              size={20}
              color={Colors.primaryColor}
            />
            <Text style={{ color: 'grey', fontSize: 13, marginLeft: 10 }}>
              {selectedComodity.address}
            </Text>
          </View>
          <View
            style={{
              borderRadius: 50,
              paddingVertical: 2,
              paddingHorizontal: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
              borderWidth: 2,
              borderColor: Colors.primaryColor,
            }}
          >
            <Text style={{ color: 'black', margin: 2, textAlign: 'center' }}>
              "{selectedComodity.description}"
            </Text>
          </View>
        </View>
      </View>
    );
  };

  //změna obsahu stránky
  const changeViewTile = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: SIZES.padding,
          paddingVertical: 8,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',

          borderTopWidth: 0.3,
          borderColor: 'grey',
        }}
      >
        <View>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              width: 40,
              backgroundColor: showMode == 'chart' ? Colors.primaryColor : null,
              borderRadius: 20,
            }}
            onPress={() => {
              setShowMode('chart');
            }}
          >
            <AntDesign
              name='piechart'
              size={24}
              color={showMode == 'chart' ? 'white' : 'black'}
            />
          </TouchableOpacity>
          {showMode === 'chart' && (
            <Text style={styles.showModeText}>Stats</Text>
          )}
        </View>
        <View>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              width: 40,
              backgroundColor: showMode == 'list' ? Colors.primaryColor : null,
              borderRadius: 20,
            }}
            onPress={() => setShowMode('list')}
          >
            <MaterialIcons
              name='format-list-bulleted'
              size={30}
              color={showMode == 'list' ? 'white' : 'black'}
            />
          </TouchableOpacity>
          {showMode === 'list' && <Text style={styles.showModeText}>List</Text>}
        </View>
        <View>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              width: 40,
              backgroundColor: showMode == 'info' ? Colors.primaryColor : null,
              borderRadius: 20,
            }}
            onPress={() => setShowMode('info')}
          >
            <MaterialIcons
              name='info-outline'
              size={28}
              color={showMode == 'info' ? 'white' : 'black'}
            />
          </TouchableOpacity>
          {showMode === 'info' && <Text style={styles.showModeText}>Info</Text>}
        </View>
        <View>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              width: 40,
              borderRadius: 20,
            }}
            onPress={() => {
              Clipboard.setString(selectedComodity.id);
              Alert.alert('Nice', 'Realty ID was copied to your clipboard', [
                { text: 'Ok' },
              ]);
            }}
          >
            <MaterialIcons name='content-copy' size={28} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //zvolená kategorie
  const setSelectedCategoryHandler = (name) => {
    let category = name;
    setSelectedCategory(category);
  };


  //zobrazení vybraných dat ve grafu
  const ChartTypeViewer = (props) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setSelected('All')}
          style={selected === 'All' ? styles.optionTile : styles.optionTile2}
        >
          <Text
            style={selected === 'All' ? styles.activeText : styles.deactiveText}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected('Y')}
          style={selected === 'Y' ? styles.optionTile : styles.optionTile2}
        >
          <Text
            style={selected === 'Y' ? styles.activeText : styles.deactiveText}
          >
            Y
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected('M')}
          style={selected === 'M' ? styles.optionTile : styles.optionTile2}
        >
          <Text
            style={selected === 'M' ? styles.activeText : styles.deactiveText}
          >
            M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelected('Select');
            Alert.alert(
              'Upsss. Sorry, we have not implemented this feature yet'
            );
          }}
          style={selected === 'Select' ? styles.optionTile : styles.optionTile2}
        >
          <Text
            style={
              selected === 'Select' ? styles.activeText : styles.deactiveText
            }
          >
            Select
          </Text>
        </TouchableOpacity>
      </View>
    );
  };


  //graf
  const GraphTile = () => {
    const chartData = CategorySummary();

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
          paddingHorizontal: 24,
          paddingVertical: 0,
        }}
      >
        <ChartTypeViewer DataChanged={() => {}} />
        {chartData.length !== 0 ? (
          <View>
            <VictoryPie
              style={{
                labels: { fill: 'white', fontSize: 18 },
                data: { fill: ({ datum }) => datum.fill },
              }}
              data={chartData}
              labels={(datum) => `${datum.y}`}
              labelComponent={<VictoryLabel angle={5} />}
              radius={({ datum }) =>
                selectedCategory && selectedCategory === datum.x
                  ? SIZES.width * 0.4
                  : SIZES.width * 0.4 - 10
              }
              innerRadius={70}
              labelRadius={({ innerRadius }) =>
                (SIZES.width * 0.5 + innerRadius) / 2.5
              }
              width={SIZES.width * 0.8}
              height={SIZES.width * 0.8}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPress: () => {
                      return [
                        {
                          target: 'labels',
                          mutation: (props) => {
                            let categoryName = chartData[props.index].x;
                            setSelectedCategoryHandler(categoryName);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
            <View style={{ position: 'absolute', top: '48%', left: '52%' }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {prepareSpent(chartData)}
              </Text>
              <Text style={{ textAlign: 'center' }}>
                {selectedComodity.currency}
              </Text>
            </View>
            <Text
              style={{
                color: Colors.primaryColor,
                fontSize: 20,
                marginTop: 10,
              }}
            >
              CATEGORIES
            </Text>
          </View>
        ) : (
          <NoDataView />
        )}
      </View>
    );
  };

  //seznam záznamů - komponent
  const recordsCategoriesList = () => {
    const data = CategorySummary();

    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            height: 40,
            marginHorizontal: 5,
            marginVertical: 2,
            paddingHorizontal: SIZES.radius,
            borderRadius: 10,
            backgroundColor:
              selectedCategory && selectedCategory === item.x
                ? categoryColor(selectedCategory.toLowerCase())
                : 'white',
          }}
          onPress={() => {
            let categoryName = item.x;
            setSelectedCategoryHandler(categoryName);
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor:
                  selectedCategory && selectedCategory !== item.x
                    ? categoryColor(item.x.toLowerCase())
                    : 'white',
                borderRadius: 5,
              }}
            ></View>
            <Text
              style={{
                marginLeft: SIZES.base,
                color: Colors.primaryColor,
                color:
                  selectedCategory && selectedCategory !== item.x
                    ? Colors.primaryColor
                    : 'white',
              }}
            >
              {item.x}
            </Text>
          </View>

          <View style={{ justifyContent: 'center' }}>
            <Text
              style={{
                color:
                  selectedCategory && selectedCategory !== item.x
                    ? 'black'
                    : 'white',
              }}
            >
              {item.y} {selectedComodity.currency} | {item.percent} %
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    if (error) {
      return (
        <View style={styles.screen}>
          <Text>An error occured!</Text>
          <Button title='Try again' onPress={loadRecords} color='pink' />
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

    if (!isLoading && records.length === 0) {
      return (
        <View style={styles.screen}>
          <Text>No Comodities in your service</Text>
          <Text>Add some now :)</Text>
        </View>
      );
    }

    return (
      <View>
        <FlatList
          data={data}
          ListHeaderComponent={GraphTile}
          onRefresh={loadRecords}
          refreshing={isRefreshing}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.x}`}
        />
      </View>
    );
  };

  //seznam záznamů
  const recordsList = () => {
    const renderRecord = ({ item }) => {
      return (
        <RecordItem
          key={item.id}
          name={item.name}
          category={item.category}
          date={item.date}
          price={item.price}
          currency={selectedComodity.currency}
          shared={item.sharedWith}
          shareStatus={item.shareStatus}
          priceType={item.priceType}
          onSelect={() => editRecordHandler(selectedComodity.id, item.id)}
          onDelete={() => deleteHandler(item.id)}
        />
      );
    };
    if (error) {
      return (
        <View style={styles.screen}>
          <Text>An error occured!</Text>
          <Button title='Try again' onPress={loadRecords} color='pink' />
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

    if (!isLoading && records.length === 0) {
      return (
        <View style={styles.screen}>
          <Text>No Records avaialbe</Text>
          <Text>Add some now :)</Text>
        </View>
      );
    }
    return (
      <View>
        <FlatList
          style={{ flexGrow: 1, paddingBottom: 150 }}
          data={availableRecords.sort((a, b) =>
            a.date < b.date ? 1 : b.date < a.date ? -1 : 0
          )}
          onRefresh={loadRecords}
          refreshing={isRefreshing}
          renderItem={renderRecord}
          keyExtractor={(item) => `${item.id}`}
        />
      </View>
    );
  };

  //rozcestník
  const whatToRender = () => {
    if (availableRecords.length !== 0) {
      if (showMode === 'chart') {
        return <View>{recordsCategoriesList()}</View>;
      } else if (showMode == 'list') {
        return <View>{recordsList()}</View>;
      } else if (showMode == 'info') {
        return (
          <ComodityInfo
            selectedComodity={selectedComodity}
            spent={prepareSpent(CategorySummary())}
            records={SummaryRecords}
          />
        );
      }
    } else if (showMode == 'info') {
      return (
        <ComodityInfo
          selectedComodity={selectedComodity}
          spent={prepareSpent(CategorySummary())}
          records={SummaryRecords}
        />
      );
    } else {
      return <EmptyComodityDetail />;
    }
  };

  return (
    <View style={styles.screen}>
      {headerTile()}
      {changeViewTile()}
      <SafeAreaView style={{ flex: 1, paddingBottom: 50 }}>
        {whatToRender()}
      </SafeAreaView>

      <FloatingButton
        style={{ bottom: 80 }}
        onSelect={() => editRecordHandler(selectedComodity.id)}
      />
    </View>
  );
};

export const screenOptions = (navigationData) => {
  const comodityId = navigationData.route.params.comodityId;

  return {
    headerTitle: 'Realty detail',
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title='Settings'
            iconName='ios-settings'
            onPress={() => {
              navigationData.navigation.navigate('ComoditySettings', {
                comodityId: comodityId,
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
  },
  image: {
    width: '100%',
    height: 300,
  },
  header: {
    flex: 1,
    height: 150,
    width: '100%',
    backgroundColor: '#ffb347',
  },

  dataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: '100%',
    backgroundColor: '#cceecc',
  },

  comodityImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  headline: {
    color: Colors.white,
    backgroundColor: '#00000070',
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  headlineName: {
    color: Colors.white,
    backgroundColor: '#00000070',
    fontSize: 35,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    marginBottom: 20,
  },

  showModeText: {
    color: Colors.primaryColor,
    textAlign: 'center',
    marginTop: 3,
    left: -2,
  },
  container: {
    flexDirection: 'row',
    width: '80%',
    height: 26,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  optionTile: {
    marginHorizontal: 2,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: '23%',
    height: '100%',
    borderRadius: 8,
  },
  optionTile2: {
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '23%',
    height: '100%',
    borderRadius: 8,
  },
  activeText: { color: Colors.white },
  deactiveText: { color: Colors.primaryColor },
});

export default DetailComodityScreen;
