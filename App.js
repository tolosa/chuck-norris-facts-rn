import React, {Component} from 'react'
import { StyleSheet, Text, ActivityIndicator, View } from 'react-native'
import { Header, Button } from 'react-native-elements'

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
        <Header centerComponent={{ text: 'CHUCK NORRIS FACTS', style: styles.header }} />
        { loading ? (
          <ActivityIndicator size='large' />
        ) : (
          <Text style={styles.factText}>{fact}</Text>
        )}
        <Button title='HIT ME!' onPress={this.getFact} buttonStyle={styles.reloadButton} disabled={loading} />
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
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  header: {
    color: '#fff',
    fontWeight: 'bold',
  },
  factText: {
    fontSize: 20,
    lineHeight: 28,
    padding: 12,
  },
  reloadButton: {
    marginBottom: 15,
    borderRadius: 5,
  },
})
