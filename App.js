import React, {Component} from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';

// TODO: move screen to separate file
class HomeScreen extends Component {
  getFact = () => { // TODO: improve method syntax
    let factText = 'New Chuck Norris fact'
    this.setState({fact: factText})
  }
  componentWillMount() {
    let factText = 'Chuck Norris fact text placeholder'
    this.setState({fact: factText})
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
