import React, { Component } from "react";
import io from "socket.io-client";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  socket = null;
  componentDidMount() {
    this.socket = io("http://192.168.0.3:1337");
    this.socket.on("connect", () => console.log("connected"));
    this.socket.on("change", payload => console.log(payload));
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
