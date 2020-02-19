import React from 'react';
import './App.css';
import { Image } from './Image';


//const URL = 'ws://192.168.1.68:7745/di/stream'; //daniel
const URL = 'ws://localhost:7745/di/stream';
const delay = 2000; //in ms
var images = [];


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: new Image("", ""), play: true, ico: "./pause.ico" };
    this.handleClick = this.handleClick.bind(this);
  }
  //websocket
  ws = new WebSocket(URL);

  //play pause butto handler
  handleClick() {

    if (this.state.play) {
      this.setState(state => ({
        ico: "./play.ico"
      }));
    } else {
      this.setState(state => ({
        ico: "./pause.ico"
      }));
    }
    this.setState(state => ({
      play: !state.play
    }));

  }

  //set a new image as state
  updateImg(newImg) {
    this.setState({ image: newImg })
  }

  componentDidMount() {

    // on connecting
    this.ws.onopen = () => {
      console.log('connected')
    }
    // on receiving a message
    this.ws.onmessage = evt => {
      const message = JSON.parse(evt.data)
      console.log("queue length: " + images.push(message))

    }
    //automatically try to reconnect on connection loss
    this.ws.onclose = ev => {
      console.log(ev.reason)
      console.log('disconnected')
      this.setState({
        ws: new WebSocket(URL),
      })
    }
    //update the state with a new image
    this.myInterval = setInterval(() => {
      if (this.state.play && images.length > 0) {
        this.updateImg(images.pop())
      }
    }, delay)
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={this.state.image.link} className="Image" alt="new" />
          <div id="wrapper">
            <div className="section">
              <button className="Play-Button" onClick={this.handleClick}>
                <img src={this.state.ico} className="Play-img" alt="new"></img>
              </button>
            </div>
            <div className="section">
              <div className="imgCaption">
                <p>
                  Image caption: {this.state.image.caption}
                </p>
              </div>

            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;


