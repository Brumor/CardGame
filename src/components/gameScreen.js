import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import Button from './Button';


// Is Ace 1 or 14 ?
const cardValues = {
  ACE: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
}

export default class GameScreen extends Component {
  constructor() {
    super();
    this.state = {
      deck_id : '',
      current_card: {},
      remaining: 0,
      user_score: 0,
    };
    this.getNewDeck = this.getNewDeck.bind(this);
    this.guessHigher = this.guessHigher.bind(this);
    this.guessLower = this.guessLower.bind(this);
  }

  componentDidMount () {
    this.getNewDeck();
  }

  getNewDeck() {
    //Gets the deck of card and draw the first one
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => {

      this.setState({deck_id: response.data.deck_id});

      axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`)
      .then(response => {
        this.setState({
          current_card: response.data.cards[0],
          remaining: response.data.remaining
        });

      });
    });
  }

  gameOver() {
    Alert.alert(
      'Game Over',
      `Your Score is : ${this.state.user_score}`,
      [
        {text: 'New Game', onPress: () => console.log('pressed')},
      ],
      {cancelable: false},
    );

    this.getNewDeck()
  }

  guessHigher() {
    axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`)
    .then(response => {
      let card = response.data.cards[0];

      let previousValue = cardValues[this.state.current_card.value];
      let newValue = cardValues[card.value];

      this.setState({
        user_score: newValue > previousValue ? this.state.user_score + 1 : this.state.user_score,
        current_card: card,
        remaining: response.data.remaining
      });

      if (response.data.remaining === 0 ) {
        this.gameOver();
      }

    })
  }

  guessLower() {
    axios.get(`https://deckofcardsapi.com/api/deck/${this.state.deck_id}/draw/?count=1`)
    .then(response => {
      let card = response.data.cards[0];

      let previousValue = cardValues[this.state.current_card.value];
      let newValue = cardValues[card.value];

      this.setState({
        user_score: newValue < previousValue ? this.state.user_score + 1 : this.state.user_score,
        current_card: card,
        remaining: response.data.remaining
      });

      if (response.data.remaining === 0 ) {
        this.gameOver()
    }});
  }

  render() {
    const {current_card, remaining, user_score} = this.state;
    const { container, imageContainer, buttonContainer, image } = styles;
    return (
      <View style={ container }>
        <Text>Remaining: { remaining }</Text>
        <Text>Score: { user_score }</Text>

        <View style={ imageContainer }>
          <Image style={image} resizeMode='contain' source={{ uri: current_card.image }} />
        </View>

        <Text>I guess the next Card will be...</Text>
        <View style={ buttonContainer }>
          <Button onPress={this.guessLower} text="Lower" />
          <Button onPress={this.guessHigher} text="Higher" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems:'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 3,
    justifyContent: 'center',
  },

  image: {
    width:300,
    height:300,
  }
});
