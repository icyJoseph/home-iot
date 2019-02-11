import React, { Component } from "react";
import io from "socket.io-client";
import axios from "axios";
import Graph from "./components/Graph";
import "./App.css";

const socketEP = "http://192.168.0.3:1337";
const dataEP = "http://192.168.0.3:9191";

class App extends Component {
  state = { historic: [], live: [], socketStatus: false };

  socket = null;

  componentDidMount() {
    this.socket = io(socketEP);
    this.socket.on("connect", () => this.setState({ socketStatus: true }));
    this.socket.on("change", ({ timestamp: name, ...rest }) =>
      this.setState(({ live: prevLive }) => {
        const live =
          prevLive.length === 50
            ? prevLive.slice(1).concat({ ...rest, name })
            : prevLive.concat({ ...rest, name });
        return {
          live
        };
      })
    );
    return axios
      .get(dataEP)
      .then(({ data: historic }) => this.setState({ historic }));
  }

  render() {
    const { socketStatus, live } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <p>
            The socket is{" "}
            <code>{socketStatus ? "connected" : "disconnected"}</code>.
          </p>
        </header>
        <div>
          <Graph data={live} />
        </div>
      </div>
    );
  }
}

export default App;
