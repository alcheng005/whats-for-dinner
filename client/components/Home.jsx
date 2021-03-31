import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const validRoomRegex = new RegExp('^[A-Z]{4}$');

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invalidCode: false
    }

    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
  }

  createRoom(e) {
    console.log('creating a room');
  }

  joinRoom(e) {
    e.preventDefault();

    const code = document.getElementById('roomId').value.toUpperCase();
    
    console.log('code:', code);

    if (!validRoomRegex.test(code)) {
      this.setState({
        ...this.state,
        invalidCode: true
      });
    } else {
      console.log('Valid room code');
    }
  }

  render() {
    return (
      <section id="homepage">
        <header>
          <h1>What's For Dinner</h1>
        </header>
        <p>Helping family and friends decide where they want to eat</p>
        <button onClick={this.createRoom}>Create a Room</button>
        <div id="emoji">🍽️</div>
        <form onSubmit={this.joinRoom}>
          <input type="text" id="roomId" name="roomId" maxLength="4" placeholder="ROOM CODE"></input>
          <br></br>
          <input type="submit" id="joinButton" name="joinButton" value="Join a Room"/>
        </form>
        {this.state.invalidCode &&
          <p>Room code is invalid!</p>
        }
      </section>
    );
  }
}

export default Home;
