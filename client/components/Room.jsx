import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phase: 'menu', // 'vote', 'results'
    };

    this.addItem = this.addItem.bind(this);
  }

  async addItem(e) {
    // prevent form from refreshing page on submit
    e.preventDefault();
  }

  render() {
    const { roomCode } = this.props.match.params;

    if (this.state.phase === 'menu') {
      return (
        <section id="roomPage-menu">
          <header>
            <h2>Room: {roomCode}</h2>
            <p>Add where or what to eat</p>
            <form onSubmit={this.joinRoom}>
            <label htmlFor="menuOption">
              <input type="text" id="menuOption" data-testid="menuOption" name="menuOption" maxLength="30" placeholder="Menu Options"></input>
            </label>
            <label htmlFor="addOption">
              <input type="submit" id="addOption" data-testid="addOption" name="addOption" value="Add Option"/>
            </label>
          </form>
          </header>
        </section>
      );
    }
  }
}

{/* <div id="roompage">
<header>
  <h2>Room: FAKE</h2>
</header>
<section id="add-remove-buttons">
  <div id="add-button">
    <button onClick={this.handleAdd}>Add item</button>
    <input type='text' id='addItem' />
  </div>
  <div id="remove-button">
    <button onClick={this.handleRemove}>Remove item</button>
    <input type='text' id='removeItem' />
  </div>
</section>
<h3>Your Plate of Food:</h3>
<div id="room-loc-list">
  {locList}
</div>
{this.state.numItems > 0 && 
  <Link to="/room/vote">
    <button id="go-to-vote-button">Take Us to Vote</button>
  </Link>
}
</div> */}

export default Room;
