import React from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const Header = (props) => {
  const {
    user,
    setUser,
    updateCreateToggle,
    updateSetUpToggle,
    myTournies,
    setMyTournies,
  } = props;

  return (
    <div className="header">
      <div className="greeting">Pickleball Tourneys</div>
      <div className="header-buttons">
        {user.uid === "DsoWpqEyMrcx6m8ViOy32uRuWjC2" ? (
          <div>
            <button
              className="header-options"
              onClick={() => updateCreateToggle(true)}
            >
              NEW TOURNEY
            </button>
            <button
              className="header-options"
              onClick={async () => {
                await firebase
                  .auth()
                  .signOut()
                  .then(function () {
                    console.log("Sign-out successful");
                  })
                  .catch(function (error) {
                    console.log("An error happened");
                  });
                setUser(null);
              }}
            >
              SIGN OUT
            </button>
          </div>
        ) : (
          <div>
            <button
              className={
                myTournies ? "header-options active" : "header-options"
              }
              onClick={() => setMyTournies(!myTournies)}
            >
              MY TOURNIES
            </button>
            <button
              className="header-options"
              onClick={() => updateSetUpToggle(true)}
            >
              UPDATE ACCOUNT
            </button>
            <button
              className="header-options"
              onClick={async () => {
                await firebase
                  .auth()
                  .signOut()
                  .then(function () {
                    console.log("Sign-out successful");
                  })
                  .catch(function (error) {
                    console.log("An error happened");
                  });
                setUser(null);
              }}
            >
              SIGN OUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
