import React, { Component } from 'react';
import uuid from 'uuid';

import * as logic from './GameLogic.js';
import {
  GameStatus,
  Players,
  Score,
  CardContainer,
  Intro,
  Replay,
  Select,
  Input,
} from './Styled.jsx';
import Card from './Card.jsx';
//TODO outstanding bugs - 2players and 3 cards results in [Object object] wins
class Game extends Component {
  state = {
    input: '',
    select: '',
    cards: logic.Deck,
    lastGame: {},
    scores: {},
    hand: [],
  };

  handleClick = event => {
    this.setState({ error: '' });
    const { select, cards, hand, input } = this.state;
    //Check if the input is empty or input is not a number if so return an
    //error message
    if (input.length < 1 || isNaN(input)) {
      return this.setState({ error: 'You must input a number' });
    }
    const noOfCards = Number(input);
    const players = Number(select);
    //Don't allow more cards to be dealt than are available
    if (noOfCards >= 26) {
      return this.setState({
        error: 'There are only 52 cards in a deck.. please enter a smaller number of cards to deal',
      });
    }
    //This returns an array of objects which represents the deck at each point in the shuffle
    const newDeck = Array.from({ length: noOfCards * (players || 2) }, () =>
      logic.dealCards(cards, noOfCards, hand, players)
    );
    //If players to cards ration is invalid an error will be returned
    if (newDeck[0] instanceof Error) {
      return this.setState({
        error: newDeck[0].message,
      });
    }
    //Set state to the deck at the end of the shuffle, also reset the current
    //hand
    const currentDeck = newDeck.slice(-1);
    this.setState({
      lastGame: currentDeck,
      scores: logic.calculateScore(currentDeck[0].hand, players),
      hand: [],
    });
  };

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    const { scores, cards, value, hand, error } = this.state;
    return (
      <div>
        <Score>
          {scores.winner &&
            (scores.winner === 'Tie'
              ? scores.winner
              : `${scores.winner} Wins!`)}
        </Score>
        <Intro>
          {error && <div>{error}</div>}
          <Input
            name="input"
            type="text"
            placeholder="Number of hands"
            value={value}
            onChange={this.handleChange}
          />
          <Select
            id="players"
            name="select"
            value={this.state.select}
            onChange={this.handleChange}
          >
            {Array.from({ length: 51 }, (option, index) => (
              <option
                value={index + 2}
                key={uuid()}
              >{`${index + 2} player(s)`}</option>
            ))}
          </Select>
          <button onClick={this.handleClick}>Deal a Hand</button>
        </Intro>
        <GameStatus>
          {scores.allScores &&
            scores.allScores.map((player, index) => (
              <CardContainer key={uuid()}>
                <h3
                >{`${scores.eachScore[index].player}, Score: ${scores.eachScore[index].score}`}</h3>
                {player.map(card => (
                  <Card key={uuid()} description={card.description} />
                ))}
              </CardContainer>
            ))}
        </GameStatus>
        <div>
          <Replay>
            {logic.replay.map(step => <li key={uuid()}>{step}</li>)}
          </Replay>
        </div>
      </div>
    );
  }
}

export default Game;
