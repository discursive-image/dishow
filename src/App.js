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
//const host = 'ws://4e0ea1a91ca2.eu.ngrok.io'; //daniel
const host = 'ws://localhost';
const port = "7745";
const streamURL = "/di/stream";
// const imagesURL = "http://192.168.1.68:"+port+"/di/images";
const imagesURL = "http://localhost:" + port + "/di/images";
// const URL = 'ws://localhost:7745/di/stream';
var images = [];
var preload;
var imagePath = imagesURL + "/"
var running = false;
// debug
var currentOnScreen;
var tot = 0;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: new Image("","","",""), play: true, darkMode: false, hideCaption: false, hideBar: false};
    this.handleClickBin = this.handleClickBin.bind(this);
    this.handleClickDarkMode = this.handleClickDarkMode.bind(this);
    this.handleClickHideCaption = this.handleClickHideCaption.bind(this);
    this.handleClickHideBar = this.handleClickHideBar.bind(this);
    this.ws = new WebSocket(host + ":" + port + streamURL);
    this.timerHandler = this.timerHandler.bind(this);
    this.imageSetter = this.imageSetter.bind(this);
  }
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
      images.push(message)
      if(!running){ // check if image setter is runnung already otherwise calls it
        this.imageSetter()
        running = true;
      }
    }
    // automatically try to reconnect on connection loss
    this.ws.onclose = ev => {
      console.log('disconnected ')
      this.setState({
        ws: new WebSocket(host + ":" + port + streamURL),
      })
    }
    
  }
  // set the image to be displayed and then set a new one if there is otherwise clear the old one
  imageSetter(){
    this.offScreenMsg(this.state.image.file_name)
    if (this.state.play && images.length > 0) {
      if (this.state.hideCaption) {// remove caption from image
        images[0].word = "";
      }
      this.updateImg(images[0])
      images = images.slice(1, images.length)// resize queque
      if (images.length > 0) {
        preload = imagesURL + "/" + images[0].file_name;
      }
    } else {
      this.updateImg(new Image("", "", "", ""));
    }
    var runAgain;
    if(this.state.image.file_name === ""){
      runAgain = false;
    }else{
      runAgain = true;
    }
    this.timerHandler(runAgain);
  }

  // if there is an image on screen it run again to clear it then stop
  timerHandler(runAgain) {
    var delay;
    var duration = (this.state.image.end_at - this.state.image.start_at) / 1000000;
    if (duration < 2000) {
      if(duration > 100){
        delay = duration
      }else{
        delay = 100;
      }
    }else{
      delay = 2000;
    }
    if(runAgain){
      setTimeout(this.imageSetter,delay)
    }else{
      running = false;
    }
  }

  onScreenMsg() {
    if (this.state.image.file_name !== "") {
      var message = JSON.stringify({ "type": "on-screen", "file_name": this.state.image.file_name});
      try {
        this.ws.send(message);
      } catch (error) {
        console.log(error);
      }
      currentOnScreen = this.state.image.file_name;
    }
  }
  offScreenMsg(imgName) {
    if (imgName !== "") {
      var message = JSON.stringify({ "type": "off-screen", "file_name": imgName });
      try {
        this.ws.send(message);
      } catch (error) {
        console.log(error);
      }
      if(imgName !== currentOnScreen){
        tot++
        console.log("img not loaded: " + imgName + " delay: " + (this.state.image.end_at - this.state.image.start_at)/1000000 + " tot: " + tot)
      }
    }
  }
  //onLoad={this.onScreenMsg(this.state.image.file_name)}
  render() {
    return (
      <div className="App" >
        <header className="App-header" style={{ backgroundColor: backgroundColor, color: fontColor }} >
          <img src={imagePath + this.state.image.file_name} className="Image" alt={this.state.image.word} onLoad={this.onScreenMsg.bind(this)} />
          <img src={preload} className="Image" style={{ display: "none" }} alt="preload"/>
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