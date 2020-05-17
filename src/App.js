import React from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./Login.js";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/">
              <Login db={db} provider={provider} />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
