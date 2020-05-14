import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { Provider } from "react-redux";
import store from "./redux/store";
import Tourneys from "./Tourneys.js";
import EditTourney from "./EditTourney.js";
import Login from "./Login.js";
import Nav from "./Nav.js";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

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

// Generate a new UUID
const id = uuidv4();

const App = () => {
  const [user, setUser] = useState(null);

  const [isOpen, setIsOpen] = useState(null);

  const [navToggle, updateNavToggle] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Nav navToggle={navToggle} updateNavToggle={updateNavToggle} />
          <Switch>
            <Route exact path="/tourneys">
              {user ? (
                <Tourneys isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/create">
              {user ? (
                <EditTourney
                  user={user}
                  id={id}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  db={db}
                />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/edit">
              {user ? (
                <EditTourney
                  user={user}
                  id={id}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  db={db}
                />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/">
              <Login
                db={db}
                provider={provider}
                user={user}
                setUser={setUser}
                navToggle={navToggle}
                updateNavToggle={updateNavToggle}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
