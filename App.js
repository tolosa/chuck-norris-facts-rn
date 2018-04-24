import React, {Component} from 'react';
import { StyleSheet, Text, Button, ActivityIndicator, View } from 'react-native';

// TODO: move screen to separate file
// TODO: add loading indicator
class HomeScreen extends Component {
  getFact = async () => {
    try {
      this.setState({loading: true})
      const response = await fetch('https://api.chucknorris.io/jokes/random')
      const responseJson = await response.json()
      const factText = responseJson.value
      this.setState({fact: factText})
    } catch (e) {
      // TODO: add error handling
    } finally {
      this.setState({loading: false})
    }
  }
  componentWillMount() {
    this.getFact()
  }
  render() {
    const {fact, loading} = this.state
    return (
      <View style={styles.container}>
        { loading ? (
          <ActivityIndicator size='large' />
        ) : (
          <Text style={styles.factText}>{fact}</Text>
        )}
        <Button title='Hit me!' onPress={this.getFact} disabled={loading} />
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
  factText: {
    fontSize: 20,
    lineHeight: 28,
    padding: 12,
  },
})
