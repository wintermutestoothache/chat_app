import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './mystyles.css';
import NavBar from './components/nav.js';
import RoomList from './components/messagecontainer/roomlist.js';
import PeopleList from "./components/messagecontainer/peoplelist.js";
import MessageColumn from "./components/messagecontainer/messageColumn.js";
import Logout from "./components/logout.js"

const init_rooms = [
  {
    "room":"bunnies",
    "has_checked":false,
  },
  {
    "room":"chessClub",
    "has_checked":true
  },
  {
    "room":"testRoom",
    "has_checked":false
    },
    {
      "room":"bunnies",
      "has_checked":false,
    },
    {
      "room":"chessClub",
      "has_checked":true
    },
    {
      "room":"testRoom",
      "has_checked":false
    },
    {
      "room":"bunnies",
      "has_checked":false,
    },
    {
      "room":"chessClub",
      "has_checked":true
    },
    {
      "room":"testRoom",
      "has_checked":false
    }
];

const init_people = [
  "potato",
  "chip"
]

const sampleMessages = [
  {"message_group_name":"bunnies",
   "messages": [
    {
      "username":"potato",
      "time":"3:47",
      "message":"hello there",
    },
    {
      "username":"chipz",
      "time":"3:48",
      "message":"I see you!"
    },
     {
       "username":"potato",
       "time":"3:50",
       "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
     },
     {
       "username":"potato",
       "time":"3:51",
       "message":"hello there",
     },
     {
       "username":"chipz",
       "time":"3:52",
       "message":"I see you!"
     },
      {
        "username":"potato",
        "time":"3:53",
        "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
      },
      {
        "username":"potato",
        "time":"3:54",
        "message":"hello there",
      },
      {
        "username":"chipz",
        "time":"3:56",
        "message":"I see you!"
      },
       {
         "username":"potato",
         "time":"3:57",
         "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
       },
       {
         "username":"potato",
         "time":"3:58",
         "message":"hello there",
       },
       {
         "username":"chipz",
         "time":"3:59",
         "message":"I see you!"
       },
        {
          "username":"potato",
          "time":"3:60",
          "message":"I see you too! Checking for a lot of text a lot of text so much text what can you do? do you wrap or just increase the width of the whole page?"
        }

   ]
  }
]

class MessageBoxContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "rooms": [],
      "currentRoomActive": this.props.activeGroup
    };
    // this is probably the place for the logic
    // if they dont have a room picked
  }
  fetchUserRooms() {
    console.log("fetching user rooms");
    this.props.socket.emit("requestRoomList", {
      "username": this.props.username,
      "currentRoomActive": this.state.currentRoomActive
    });
  }
  componentDidMount() {

    this.props.socket.on("newMessage", (data) => {
      console.log("triggered in messageBoxContainer")
    });

    this.props.socket.on("roomListInit",(data) => {
      console.log("roomList Init fired");
      this.setState({
        "rooms": data
      });
    })
    this.fetchUserRooms();
  }
  render() {

    return (
      <div className="columns is-mobile" id="column-box">
        <div className="column is-4" id="left-column">
        <div id="leftcolumn">
          <RoomList rooms={this.state.rooms} />
          <PeopleList people={init_people} />
        </div>
        </div>
        <div className="column is-8" id="right-column">
          <MessageColumn
            socket={this.props.socket}
            activeRoom={this.props.activeGroup}
          />
        </div>
      </div>
    )
  }
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "username":"",
      "is_authenticated":false,
      "selectedGroupAtLog":"",
      "userId":""
    };
    // this probably needs to be updated for deployment
    this.socket = io("http://localhost");
  }

  componentDidMount() {

    this.socket.on('connect_response', (data) => {
      if (data.authenticated == false) {
        window.location = 'chat/login';
      } else {
        this.setState({
          "username": data.username,
          "userId": data.userId,
          "is_authenticated": true,
          "selectedGroupAtLog": data.selectedGroup
        });
      }
      console.log(this.state);
    });

  }

  render() {
    if (this.state.username == ""){
      return <div />
    }
    return (
      <div id="main">
        <div id="main-head">
          <p className="title has-text-white level-left">Messages</p>
          <Logout />
        </div>
        <div id="main-body" >
          <MessageBoxContainer
            socket={this.socket}
            username={this.state.username}
            activeGroup={this.state.selectedGroupAtLog}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#root")
);
