import React, { Component } from 'react'
import { StyleSheet, Text, Picker, ActivityIndicator, View, FlatList, AsyncStorage } from 'react-native'
import { Header, Button, FormLabel, Icon, CheckBox, Divider } from 'react-native-elements'
import { createBottomTabNavigator } from 'react-navigation'

const PRIMARY_COLOR = '#3470e2'
const FAV_COLOR = '#ffda3b'

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

class FavoritesStore {
  constructor() {
    this.list = [] // TODO: find better way to solve this
    this.loadFavoritesFromStorage()
      .then(favorites => this.list = favorites)
  }
  addFact(fact) {
    AsyncStorage.setItem(fact.id, JSON.stringify(fact))
    this.list.push(fact)
  }
  removeFact(fact) {
    AsyncStorage.removeItem(fact.id)
    const index = this.list.findIndex(item => item.id === fact.id)
    if (index > -1) this.list.splice(index, 1)
  }
  isFavorite(fact) {
    return this.list.findIndex(item => item.id === fact.id) > -1
  }
  loadFavoritesFromStorage() {
    return AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiGet(keys))
      .then(values => values.map(value => JSON.parse(value[1])))
  }
}

const favorites = new FavoritesStore()

class Fact extends Component {
  constructor(props) {
    super(props)
    this.state = {faved: favorites.isFavorite(props.fact)}
  }
  onFaved = () => {
    const faved = !this.state.faved
    this.setState({faved})
    const fact = this.props.fact
    if(faved) {
      favorites.addFact(fact)
    } else {
      favorites.removeFact(fact)
    }
  }
  render() {
    return !this.props.fact ? null : (
      <View>
        <Text style={styles[`factText__${this.props.variant}`]}>{this.props.fact.value}</Text>
        <CheckBox
          size={30} checkedColor={FAV_COLOR} uncheckedColor={FAV_COLOR}
          iconType='material' checkedIcon='star' uncheckedIcon='star-border'
          containerStyle={styles.favCheckContainer}
          checked={this.state.faved}
          onPress={this.onFaved}
        />
      </View>
    )
  }
}

// TODO: move screen to separate file
class FactsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => <Icon name='mood' color={tintColor} />
  }
  getFact = async() => {
    try {
      this.setState({loading: true})
      let url = 'https://api.chucknorris.io/jokes/random'
      const category = this.state.category
      if(category && category !== 'any') url += `?category=${category}` // TODO: find proper way of building URL parameters
      const response = await fetch(url)
      const fact = await response.json()
      this.setState({fact})
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
        <Header
          centerComponent={{text: 'GET CHUCK NORRIS FACTS', style: styles.header}}
          backgroundColor={PRIMARY_COLOR} />
        { loading ? ( // TODO: change activity indicator, show only on button
          <ActivityIndicator size='large' />
        ) : (
          <Fact fact={fact} variant='detail' />
        )}
        <View>
          <FormLabel>CATEGORIES</FormLabel>
          <Picker selectedValue={category}
            itemStyle={styles.categoriesSelector}
            onValueChange={(value, index) => this.setState({category: value})}>
            { categories.map((item, key) =>
              <Picker.Item label={item.capitalize()} value={item} key={key} />
            )}
          </Picker>
          <Button title='HIT ME!'
            onPress={this.getFact}
            buttonStyle={styles.reloadButton}
            disabled={loading} backgroundColor={PRIMARY_COLOR} />
        </View>
      </View>
    )
  }
}

class FavoritesScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor}) => <Icon name='star' color={tintColor} />
  }
  renderRow(data) {
    return (
      <Fact fact={data.item} variant='list' />
    )
  }
  render() {
    return (
      <View>
        <Header
          centerComponent={{text: 'MY FAVORITE FACTS', style: styles.header}}
          backgroundColor={PRIMARY_COLOR} />
        <FlatList
          data={favorites.list}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => item.id}
          ItemSeparatorComponent={() =>
            <Divider style={styles.favoritesDivider} />
          }
        />
      </View>
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
  factText__detail: {
    fontSize: 20,
    lineHeight: 25,
    paddingLeft: 12,
    paddingRight: 12,
  },
  factText__list: {
    fontSize: 15,
    lineHeight: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  favCheckContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  favoritesDivider: {
    marginTop: 4,
    marginBottom: 6,
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
