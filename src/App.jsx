import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [show, setShow] = useState(true);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShow(false);
    }
  };
  return (
    <div className="App">
      {show ? (
        <>
          <div className="joinChatContainer">
            <input
              type="text"
              placeholder="username"
              onChange={(event) => setUserName(event.target.value)}
              onKeyPress={(event) => {
                event.key === "Enter" && joinRoom();
              }}
              required
            />
            <input
              type="text"
              placeholder="room id"
              onChange={(event) => setRoom(event.target.value)}
              onKeyPress={(event) => {
                event.key === "Enter" && joinRoom();
              }}
              required
            />
            <button onClick={joinRoom}>Join Room</button>
            <div id="toggle">
              <details>
                <summary>How to join?</summary>
                <p>
                  Enter your username and room id. Make sure your chat partner
                  uses the same room id as yours. Or you can open another tab
                  with the same room id to test.
                </p>
              </details>
            </div>
          </div>
        </>
      ) : (
        <Chat socket={socket} userName={userName} room={room}></Chat>
      )}
    </div>
  );
}

export default App;
