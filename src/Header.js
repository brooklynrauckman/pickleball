import React from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const Header = (props) => {
  const { user, setUser, updateCreateToggle } = props;

  return (
    <div className="header">
      <div className="greeting">{user.displayName}'s Pickleball Tourneys</div>
      <div>
        <button className="sign-in" onClick={() => updateCreateToggle(true)}>
          NEW TOURNEY
        </button>
        <button
          className="sign-in"
          onClick={async () => {
            await firebase.auth().signOut();
            setUser(null);
          }}
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
};

export default Header;
