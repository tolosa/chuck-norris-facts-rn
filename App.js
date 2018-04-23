import React, {Component} from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';

// TODO: move screen to separate file
// TODO: add loading indicator
class HomeScreen extends Component {
  state = {fact: 'Loading...'}
  getFact = async () => { // TODO: improve method syntax
    try {
      const response = await fetch('https://api.chucknorris.io/jokes/random')
      const responseJson = await response.json()
      const factText = responseJson.value
      this.setState({fact: factText})
    } catch (e) {
      // TODO: add error handling
    }
  }
  componentWillMount() {
    this.getFact()
  }
  render() {
    const {fact} = this.state
    return (
      <View style={styles.container}>
        <Text>{fact}</Text>
        <Button title='Get new' onPress={this.getFact} />
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
