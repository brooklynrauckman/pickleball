import React from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const Header = (props) => {
  const { user, setUser, updateCreateToggle, updateSetUpToggle, setUp } = props;

  return (
    <div className="header">
      <div className="greeting">Hello, {user.displayName}!</div>
      <div>
        {user.displayName === "Brooklyn Rauckman" ? (
          <button className="sign-in" onClick={() => updateCreateToggle(true)}>
            NEW TOURNEY
          </button>
        ) : null}
        <React.Fragment>
          {user.displayName === "Brooklyn Rauckman" ? null : (
            <button className="sign-in" onClick={() => updateSetUpToggle(true)}>
              {setUp ? "EDIT ACCOUNT" : "CREATE ACCOUNT"}
            </button>
          )}
          <button
            className="sign-in"
            onClick={async () => {
              await firebase.auth().signOut();
              setUser(null);
            }}
          >
            SIGN OUT
          </button>
        </React.Fragment>
      </div>
    </div>
  );
};

export default Header;
