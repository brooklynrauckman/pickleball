import React, { useState, useEffect } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Tourneys from "./Tourneys.js";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyDQtJPoGRIOEu7eau2IJC-VBdra6OBB2Gc",
  authDomain: "pickleball-cd052.firebaseapp.com",
  databaseURL: "https://pickleball-cd052.firebaseio.com",
  projectId: "pickleball-cd052",
  storageBucket: "pickleball-cd052.appspot.com",
  messagingSenderId: "883478017627",
  appId: "1:883478017627:web:6a235091d9ae79ffebf17e",
  measurementId: "G-819VQP0LRZ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// PROVIDER
const provider = new firebase.auth.GoogleAuthProvider();

const App = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [courts, setCourts] = useState(1);

  // Generate a new UUID
  const id = uuidv4();

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

  // Create Badge
  async function createTourney(title, deadline, date, time, location, courts) {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();
      const tempList = querySnapshot.docs[0].get("tournaments");
      tempList.push({
        title: title,
        deadline: deadline,
        date: date,
        time: time,
        location: location,
        courts: courts,
        admin: user.uid,
        id: id,
      });
      querySnapshot.docs[0].ref.update({
        tournaments: tempList,
      });
    } catch (error) {
      console.log("Error updating tournament.", error);
    }
  }

  return (
    <div className="App">
      <div className="title">Pickleball Tourneys</div>
      {user ? <div className="greeting">Hello, {user.displayName}</div> : ""}
      {user ? (
        <button
          className="sign-in"
          onClick={async () => {
            await firebase.auth().signOut();
            setUser(null);
          }}
        >
          Sign Out
        </button>
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
      {user ? (
        <React.Fragment>
          <input
            className="create-badge"
            placeholder="Tournament Title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <input
            className="create-badge"
            placeholder="Tournament Date"
            type="text"
            onChange={(e) => setDate(e.target.value)}
          ></input>
          <input
            className="create-badge"
            placeholder="Tournament Time"
            type="text"
            onChange={(e) => setTime(e.target.value)}
          ></input>
          <input
            className="create-badge"
            placeholder="Tournament Location"
            type="text"
            onChange={(e) => setLocation(e.target.value)}
          ></input>
          <input
            className="create-badge"
            placeholder="Number of Courts"
            type="text"
            onChange={(e) => setCourts(e.target.value)}
          ></input>
          <input
            className="create-badge"
            placeholder="Sign up Deadline"
            type="text"
            onChange={(e) => setDeadline(e.target.value)}
          ></input>
          <button
            onClick={() =>
              createTourney(title, deadline, date, time, location, courts)
            }
          >
            Create Tournament
          </button>
          <Tourneys
            user={user}
            title={title}
            date={date}
            location={location}
            time={time}
            deadline={deadline}
            courts={courts}
          />
        </React.Fragment>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
