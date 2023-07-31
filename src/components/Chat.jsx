import { Component } from "react";
import Messages from "./Messages";
import Input from "./Input";

const state = {
  messages: [],
  member: {
    username: randomName(),
    color: randomColor(),
  },
};

function randomName() {
  const random = Math.floor(Math.random() * 1000);
  return "Polaznik" + random;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

class Chat extends Component {
  constructor() {
    super();
    this.state = state;
    this.drone = new window.Scaledrone("CMa7k5ck4pRKdK3L", {
      data: this.state.member,
    });
    this.drone.on("open", (error) => {
      if (error) {
        console.error(error);
        return;
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });
    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = [...this.state.messages];
      messages.push({ member, text: data, timestamp: new Date() });
      this.setState({ messages });
    });
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };

  render() {
    return (
      <>
        <div className="App">
          <Messages
            messages={this.state.messages}
            currentMember={this.state.member}
          />
          <Input onSendMessage={this.onSendMessage} />
        </div>
      </>
    );
  }
}

export default Chat;
