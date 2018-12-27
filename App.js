import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform } from 'react-native';
import Home from './components/Home';
import AddDeck from './components/AddDeck';
import AddCard from './components/AddCard';
import Deck from './components/Deck';
import Quiz from './components/Quiz';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import {
  createTabNavigator,
  createStackNavigator,
  NavigationActions
} from 'react-navigation';
import { white, black, teal } from './utils/colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Constants } from 'expo';
import { setLocalNotification, clearLocalNotification } from './utils/helpers';

function FlashcardsStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const Tabs = createTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: 'Deck',
        headerMode: 'none',
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="cards-outline"
            size={30}
            color={tintColor}
          />
        )
      }
    },
    AddDeck: {
      screen: AddDeck,
      navigationOptions: {
        tabBarLabel: 'Add Deck',
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="add" size={30} color={tintColor} />
        )
      }
    }
  },
  {
    navigationOptions: {
      header: null,
      headerMode: 'none'
    },
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? teal : white,
      showLabel: Platform.OS === 'android',
      style: {
        height: 56,
        backgroundColor: Platform.OS === 'ios' ? white : teal,
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 6,
        shadowOpacity: 1
      }
    }
  }
);

const MainNavigator = createStackNavigator({
  Home: {
    screen: Tabs,
    navigationOptions: {
      headerMode: 'none'
    }
  },
  AddDeck: {
    screen: AddDeck,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: teal
      }
    }
  },
  Deck: {
    screen: Deck,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: teal
      }
    }
  },
  AddCard: {
    screen: AddCard,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: teal
      }
    }
  },
  Quiz: {
    screen: Quiz,
    navigationOptions: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: teal
      }
    }
  }
});

export default class App extends Component {
  componentDidMount() {
    clearLocalNotification();
    setLocalNotification();
  }
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{ flex: 1 }}>
          <FlashcardsStatusBar
            backgroundColor={white}
            barStyle="light-content"
          />
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}
