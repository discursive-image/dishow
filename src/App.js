import React from 'react';
import './App.css';
import { Image } from './Image';


// Style variables
var backgroundColor = "#e3e9f3";
var fontColor = "black";
var checked = "./Icons/Selected-button.png";
var unchecked = "./Icons/Unselected-button.png";
var hideCaptionsrc = unchecked;
var hideBarsrc = unchecked;
var darkModesrc = unchecked;

// URLS variables
// const host = 'ws://192.168.1.68'; //daniel
const host = 'ws://localhost';
const port = "7745";
const streamURL = "/di/stream";
// const imagesURL = "http://192.168.1.68:"+port+"/di/images";
const imagesURL = "http://localhost:" + port + "/di/images";

// const URL = 'ws://localhost:7745/di/stream';



var delay = 2000; //in ms
var images = [];
var nextImg = new Image("", "");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: new Image("", ""), play: true, darkMode: false, hideCaption: false, hideBar: false };
    this.handleClickBin = this.handleClickBin.bind(this);
    this.handleClickDarkMode = this.handleClickDarkMode.bind(this);
    this.handleClickHideCaption = this.handleClickHideCaption.bind(this);
    this.handleClickHideBar = this.handleClickHideBar.bind(this);
  }
  // websocket
  ws = new WebSocket(host + ":" + port + streamURL);

  // play pause button handler
  handleClickPlay() {
    this.setState(state => ({
      play: !state.play
    }));
  }

  handleClickDarkMode() {
    var dark = "#282c34" // PER MAX ////////////////////////////////
    var light = "#e3e9f3" // PER MAX ///////////////////////////////
    if (this.state.darkMode) {
      backgroundColor = light
      fontColor = "black"
      darkModesrc = unchecked
    } else {
      backgroundColor = dark
      fontColor = "white"
      darkModesrc = checked
    }

    this.setState(state => ({
      darkMode: !state.darkMode
    }));
    console.log("dark")
  }

  handleClickBin() {
    images = [];
  }

  handleClickLogo() {
  }
  handleClickHideCaption() {
    console.log("hide")
    if (this.state.hideCaption) {
      hideCaptionsrc = unchecked
    } else {
      hideCaptionsrc = checked
    }
    this.setState(state => ({
      hideCaption: !state.hideCaption
    }));
  }
  handleClickHideBar() {
    console.log("bar")
    if (this.state.hideBar) {
      hideBarsrc = unchecked
    } else {
      hideBarsrc = checked
    }
    this.setState(state => ({
      hideBar: !state.hideBar
    }));
  }

  // set a new image as state
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
      console.log(message)
      console.log("queue length: " + images.push(message))

    }
    // automatically try to reconnect on connection loss
    this.ws.onclose = ev => {
      console.log('disconnected')
      this.setState({
        ws: new WebSocket(host + ":" + port + streamURL),
      })
    }

    // update the state with a new image
    this.myInterval = setInterval(() => {
      if (this.state.play && images.length > 0) {
        this.updateImg(images[0])
        images = images.slice(1, images.length)
        if (images.length > 1) {
          nextImg = images[1];
          console.log(imagesURL + "/" + nextImg.file_name)
        }

      }
    }, delay)
  }

  render() {
    return (
      <div className="App" >
        <header className="App-header" style={{ backgroundColor: backgroundColor, color: fontColor }} >
          <img src={imagesURL + "/" + this.state.image.file_name} className="Image" alt="new" />
          <div id="wrapper" style={{ backgroundColor: backgroundColor }}>
            <div className="section">
              <div className="dropdown">
                <img src="./Logo/Logo_Dirscursiveimage2020.png" className="LogoButton" alt="new"></img>
                <div className="dropdown-content" style={{ backgroundColor: backgroundColor }}>
                  <div className="dropdownDiv" style={{ backgroundColor: "black", color: "white", height: "30px" }}>
                    <p>options</p>
                  </div>
                  <div className="dropdownDiv">
                    <p>Clear queue</p>
                    <img className="menuButtons" id="hideBarButton" src="./Icons/Clear-button.png" alt="hidebar" onClick={this.handleClickBin}></img>
                  </div>
                  <div className="dropdownDiv">
                    <p>Hide caption</p>
                    <img className="menuButtons" id="hideCaptionButton" src={hideCaptionsrc} alt="hidecaption" onClick={this.handleClickHideCaption}></img>
                  </div>
                  <div className="dropdownDiv" >
                    <p>Dark mode</p>
                    <img className="menuButtons" id="drakModeButton" src={darkModesrc} alt="darkmode" onClick={this.handleClickDarkMode}></img>
                  </div>
                  <div className="dropdownDiv">
                    <p>Play/Pause</p>
                    <img className="menuButtons" id="hideBarButton" src="./Icons/Pause-button.png" alt="hidebar" onClick={this.handleClickPlay}></img>
                  </div>
                  <div className="dropdownDiv">
                    <p>Hide bar</p>
                    <img className="menuButtons" id="hideBarButton" src={hideBarsrc} alt="" onClick={this.handleClickHideBar}></img>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="imgCaption">
                <p>
                  {this.state.image.word}
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
