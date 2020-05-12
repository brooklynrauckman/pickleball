import React, { Component } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Badges from "./Badges.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFSnsQiqaQPLXot7h0a5nvwhs_f7vdzaE",
  authDomain: "badges-794fc.firebaseapp.com",
  databaseURL: "https://badges-794fc.firebaseio.com",
  projectId: "badges-794fc",
  storageBucket: "badges-794fc.appspot.com",
  messagingSenderId: "289148597743",
  appId: "1:289148597743:web:82181a924fb23f8225b21a",
  measurementId: "G-SRMF9BQYB2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// PROVIDER
const provider = new firebase.auth.GoogleAuthProvider();

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: null,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      this.setState({
        user: user
      })
    } else {
      console.log('...none')
      // User is signed out.
    }
  });
  }

  // Create Badge
  async setBadge(challenge) {
    try{
      const querySnapshot = await db.collection("users").where("userId", "==", this.state.user.uid).get()
      const tempList = querySnapshot.docs[0].get('badge');
      tempList.push({
              title: challenge,
              completed: false,
      });
      querySnapshot.docs[0].ref.update({
        badge: tempList
      });
    } catch(error){
      console.log("Error updating badges: ", error);
    };
  }

  render() {

  return (
    <div className="App">
      <div className="title">Challenge By Choice</div>
        {
          this.state.user
            ? <div className="greeting">Hello, {this.state.user.displayName}</div>
            : ''
        }
        {
          this.state.user
            ? <button className="sign-in" onClick={async()=>{
                  await firebase.auth().signOut()
                  this.setState({
                    user: null
                  })
              }}
              >Sign Out
              </button>
            : <button className="sign-in" onClick={async()=>{
                  const result = await firebase.auth().signInWithPopup(provider)
                  this.setState({
                    user: result.user
                  })
                  const querySnapshot = await db.collection("users").where("userId", "==", this.state.user.uid).get();
                  if (querySnapshot.docs.length === 0) {
                     db.collection("users").add({
                        "username": this.state.user.displayName,
                        "userId": this.state.user.uid,
                        "badge": [{
                          title:"Ex. 30 days no sugar",
                          completed: false,
                        }]
                    })
                  }
              }}
              >Sign in with Google
              </button>
          }
      {this.state.user ?
        <React.Fragment>
          <input className="create-badge" placeholder="New challenge..." type="text"
               onKeyDown={(e) => e.key === 'Enter' && e.target.value.length ? this.setBadge(e.target.value) : null}
          >
          </input>
          <Badges user={this.state.user} />
        </React.Fragment>
      : ''}
    </div>
  );
  }
}

export default App;
