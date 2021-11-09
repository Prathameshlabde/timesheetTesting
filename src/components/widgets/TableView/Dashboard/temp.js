import React, { Component } from "react";
// import all stuff about react-contextmenu
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
// import "./RightClick.scss";
export default class App extends Component {
  // get object data after display on alert
  handleClick = (e, data) => {
    alert(`Clicked on menu ${data.item}`);
  };
  render() {
    return (
      <div className="bg">
        <ContextMenuTrigger id="add_same_id">
          <div className="hight">Right Click for Open Menu</div>
        </ContextMenuTrigger>
        <ContextMenu className="menu" id="add_same_id">
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Home" }}
            className="menuItem"
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Post" }}
            className="menuItem"
          >
            Post
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Create Post" }}
            className="menuItem"
          >
            Create Post
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "All Post" }}
            className="menuItem"
          >
            All Post
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Stats" }}
            className="menuItem"
          >
            Stats
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Chat" }}
            className="menuItem"
          >
            Chat
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Settings" }}
            className="menuItem"
          >
            Settings
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Profile" }}
            className="menuItem"
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={this.handleClick}
            data={{ item: "Logout" }}
            className="menuItem"
          >
            Logout
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}
