import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { v4 as uuidv4 } from "uuid";

import Tourneys from "./Tourneys.js";
import CreateTourney from "./CreateTourney.js";
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
  const [title, setTitle] = useState(null);
  const [deadline, setDeadline] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState(null);
  const [gender, setGender] = useState("");
  const [fee, setFee] = useState(0);
  const [contact, setContact] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [details, setDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(null);
  const [tournaments, updateTournaments] = useState([]);

  const [navToggle, updateNavToggle] = useState(false);

  return (
    <Router>
      <div className="App">
        <Nav navToggle={navToggle} updateNavToggle={updateNavToggle} />
        <Switch>
          <Route exact path="/tourneys">
            {user ? (
              <Tourneys
                user={user}
                id={id}
                title={title}
                date={date}
                venue={venue}
                deadline={deadline}
                courts={courts}
                gender={gender}
                fee={fee}
                contact={contact}
                organizer={organizer}
                details={details}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                tournaments={tournaments}
                updateTournaments={updateTournaments}
              />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route exact path="/create">
            {user ? (
              <CreateTourney
                user={user}
                id={id}
                setTitle={setTitle}
                setDate={setDate}
                setVenue={setVenue}
                setDeadline={setDeadline}
                setCourts={setCourts}
                title={title}
                date={date}
                venue={venue}
                deadline={deadline}
                courts={courts}
                gender={gender}
                setGender={setGender}
                fee={fee}
                setFee={setFee}
                contact={contact}
                setContact={setContact}
                organizer={organizer}
                setOrganizer={setOrganizer}
                details={details}
                setDetails={setDetails}
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
                setTitle={setTitle}
                setDate={setDate}
                setVenue={setVenue}
                setDeadline={setDeadline}
                setCourts={setCourts}
                title={title}
                date={date}
                venue={venue}
                deadline={deadline}
                courts={courts}
                gender={gender}
                setGender={setGender}
                fee={fee}
                setFee={setFee}
                contact={contact}
                setContact={setContact}
                organizer={organizer}
                setOrganizer={setOrganizer}
                details={details}
                setDetails={setDetails}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                db={db}
                tournaments={tournaments}
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
  );
};

export default App;
