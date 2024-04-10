/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
// import { IoMdSend } from "react-icons/io";

const Chat = ({ socket, userName, room }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    const timeString = `${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
    const messageObject = {
      message,
      room,
      userName,
      time: timeString,
    };
    if (message !== "") {
      await socket.emit("send_message", messageObject);
      setMessageList((list) => [...list, messageObject]);
      setMessage("");
    }
  };

  useEffect(() => {
    const receiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket]);
  return (
    <div className="chat_window">
      <div className="chat_header">
        <p>Active Chat</p>
      </div>
      <div className="chat_body">
        <ScrollToBottom className="message_container">
          {messageList.map((message) => {
            return (
              <div
                className="message"
                id={userName === message.userName ? "you" : "other"}
                key={uuidv4()}
              >
                <div>
                  <div className="message_content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message_meta">
                    <p id="time">{message.time}</p>
                    <p id="author">{message.userName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat_footer">
        <input
          type="text"
          value={message}
          placeholder="Write text"
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>
          {/* <IoMdSend /> */}
          send
        </button>
      </div>
    </div>
  );
};

export default Chat;
