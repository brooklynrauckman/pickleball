import React, { useEffect } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const Login = (props) => {
  const { db, provider, user, setUser } = props;

  const createUser = async (user) => {
    if (!user.username || !user.userId) {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();
      if (querySnapshot.docs.length === 0) {
        db.collection("users").add({
          username: user.displayName,
          userId: user.uid,
          tournaments: [],
        });
      }
    }
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUser(user);
        createUser(user);
      } else {
        console.log("...none");
        // User is signed out.
      }
    });
  }, [user]);
  return (
    <div className="login-page">
      <div className="title">Pickleball Tourneys</div>
      {user ? (
        <React.Fragment>
          <div className="greeting">Hello, {user.displayName}</div>
          <button
            className="sign-in"
            onClick={async () => {
              await firebase.auth().signOut();
              setUser(null);
            }}
          >
            Sign Out
          </button>
        </React.Fragment>
      ) : (
        <button
          className="sign-in"
          onClick={async () => {
            await firebase.auth().signInWithPopup(provider);
          }}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Login;
