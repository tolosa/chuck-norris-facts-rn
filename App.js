import React, {Component} from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';

// TODO: move screen to separate file
class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Chuck Norris fact text placeholder</Text>
        <Button title='Get new' />
      </View>
    )
  }
}

export default class App extends Component {
  render() {
    return <HomeScreen />
  }
}

// TODO: move styles to separate file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
