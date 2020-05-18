import React, { useEffect, useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Tourneys from "./Tourneys.js";

const Login = (props) => {
  const { db, provider } = props;
  const [user, setUser] = useState(null);

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
          setUp: false,
          tournaments: [],
          account: [],
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
    <React.Fragment>
      {user ? (
        <Tourneys user={user} setUser={setUser} db={db} />
      ) : (
        <div className="login-page">
          <div className="title">Pickleball Tourneys</div>
          <button
            className="sign-in"
            onClick={async () => {
              await firebase.auth().signInWithPopup(provider);
            }}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default Login;
