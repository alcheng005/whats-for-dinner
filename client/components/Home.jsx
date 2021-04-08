import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

const { validRoomChars } = require('../../config.js');

const validRoomRegex = new RegExp(`^[${validRoomChars}]{4}$`);

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: '',
      roomCode: '',
    };

    this.createRoom = this.createRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
  }

  async createRoom() {
    const res = await fetch('http://localhost:3000/room/create-room');
    const { roomCode } = await res.json();

    // room code returned is a valid room
    if (validRoomRegex.test(roomCode)) {
      this.setState({
        ...this.state,
        errorMsg: '',
        roomCode: roomCode,
      });
    // room code returned is not a valid room
    } else {
      this.setState({
        ...this.state,
        errorMsg: 'Room code is invalid',
        roomCode: '',
      });
    }
  }

  async joinRoom(e) {
    // prevent form from refreshing page on submit
    e.preventDefault();

    const code = document.getElementById('roomCode').value.toUpperCase();

    console.log('joinRoom code:', code);

    // room code is not a valid room
    if (!validRoomRegex.test(code)) {
      this.setState({
        ...this.state,
        errorMsg: 'Room code is invalid',
        roomCode: '',
      });
    } else {
      const res = await fetch('http://localhost:3000/room/join-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const { roomCode } = await res.json();

      // server found an issue with the room code and returned null
      if (roomCode === null) {
        this.setState({
          ...this.state,
          errorMsg: 'Room not found',
          roomCode: '',
        });
      // if no issue, load up the room that was returned from server
      } else {
        this.setState({
          ...this.state,
          errorMsg: '',
          roomCode: roomCode,
        });
      }
    }
  }

  render() {
    if (this.state.roomCode !== '') {
      return <Redirect to={`/room/${this.state.roomCode}`}/>;
    }

    return (
      <section id="homePage">
        <div id="emoji">🍽️</div>
        <header>
          <h1>What's For Dinner</h1>
        </header>
        <p>Helping family and friends decide where they want to eat</p>
        <button id="createRoom" onClick={this.createRoom}>Create Room</button>
        {/* <div id="emoji">🍽️</div> */}
        <form onSubmit={this.joinRoom}>
          <label htmlFor="roomCode">
            <input type="text" id="roomCode" data-testid="roomCode" name="roomCode" maxLength="4" placeholder="ROOM CODE"></input>
          </label>
          <br></br>
          <label htmlFor="joinButton">
            <input type="submit" id="joinButton" data-testid="joinButton" name="joinButton" value="Join Room"/>
          </label>
        </form>
        {this.state.errorMsg !== '' &&
          <p>{this.state.errorMsg}</p>
        }
      </section>
    );
  }
}

export default Home;
