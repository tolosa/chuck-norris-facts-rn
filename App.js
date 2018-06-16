import React, { Component } from 'react'
import { StyleSheet, Text, Picker, ActivityIndicator, View } from 'react-native'
import { Header, Button, FormLabel, Icon } from 'react-native-elements'
import { createBottomTabNavigator } from 'react-navigation'

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

class Joke extends Component {
  render() {
    return (
      <Text style={styles.factText}>{this.props.children}</Text>
    )
  }
}

// TODO: move screen to separate file
class FactsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => <Icon name='mood' color={tintColor} />
  }
  getFact = async () => {
    try {
      this.setState({loading: true})
      let url = 'https://api.chucknorris.io/jokes/random'
      const category = this.state.category
      if(category && category !== 'any') url += `?category=${category}` // TODO: find proper way of building URL parameters
      const response = await fetch(url)
      const responseJson = await response.json()
      const factText = responseJson.value
      this.setState({fact: factText})
    } catch (e) {
      // TODO: add error handling
    } finally {
      this.setState({loading: false})
    }
  }
  getCategories = async() => {
    try {
      this.setState({categories: []})
      const response = await fetch('https://api.chucknorris.io/jokes/categories')
      const categories = await response.json()
      categories.sort().unshift('any')
      this.setState({categories: categories})
    } catch (e) {
      // TODO: add error handling
    }
  }
  componentWillMount() {
    this.getFact() // TODO: fix initial loading of fact
    this.getCategories()
  }
  render() {
    const {fact, loading, categories, category} = this.state
    return (
      <View style={styles.container}>
        <Header centerComponent={{ text: 'CHUCK NORRIS FACTS', style: styles.header }} /> // TODO: show header on all screens
        { loading ? (
          <ActivityIndicator size='large' />
        ) : (
          <Joke>{fact}</Joke>
        )}
        <View>
          <FormLabel>CATEGORIES</FormLabel>
          <Picker selectedValue={category}
            itemStyle={styles.categoriesSelector}
            onValueChange={(value, index) => this.setState({category: value})}>
            { categories.map((item, key)=>(
              <Picker.Item label={item.capitalize()} value={item} key={key} />)
            )}
          </Picker>
          <Button title='HIT ME!' onPress={this.getFact} buttonStyle={styles.reloadButton} disabled={loading} />
        </View>
      </View>
    )
  }
}

class FavoritesScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => <Icon name='star' color={tintColor} />
  }
  render() {
    return (
      <View></View>
    )
  }
}

export default createBottomTabNavigator({
  Facts: FactsScreen,
  Favorites: FavoritesScreen,
})

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
  categoriesSelector: {
    textAlign: 'left',
    marginLeft: 20,
    fontSize: 18,
  },
})
