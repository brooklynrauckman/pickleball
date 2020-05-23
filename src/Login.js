import React, { useEffect, useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Tourneys from "./Tourneys.js";
import { TextField } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { updateAccount } from "./redux/actions/actions";

const Login = (props) => {
  const { db, updateSetUpToggle, setUpToggle } = props;
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const { account } = useSelector((state) => ({
    account: state.pickleball.account,
  }));

  const awaitUser = async () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("signed in", user);
        createUser(user);
      } else {
        console.log("signed out");
      }
    });
  };
  const createUser = async (user) => {
    const querySnapshot = await db
      .collection("users")
      .where("userId", "==", user.uid)
      .get();
    if (querySnapshot.docs.length === 0) {
      console.log("new doc", querySnapshot.docs);
      db.collection("users").add({
        userId: user.uid,
        tournaments: [],
        account: {
          name: "",
          phone: "+1",
          zipcode: "",
          birthdate: "2020-05-20",
          skill: 0,
          gender: "",
          userEmail: user.email,
        },
      });
    }
  };

  const signIn = async () => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        const errorMessage = error.message;
        window.alert("Error on sign in:", errorMessage);
      });
    setUser(user);
    awaitUser();
  };

  const signUp = async () => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        const errorMessage = error.message;
        window.alert("Error on sign up:", errorMessage);
      });
    signIn();
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, [user]);

  return (
    <React.Fragment>
      {user ? (
        <Tourneys
          user={user}
          setUser={setUser}
          db={db}
          updateSetUpToggle={updateSetUpToggle}
          setUpToggle={setUpToggle}
        />
      ) : (
        <div className="login-page">
          <div className="title">Pickleball Tourneys</div>
          <div className="login-controls">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              onChange={(e) => {
                dispatch(updateAccount({ userEmail: e.target.value }));
                setEmail(e.target.value);
              }}
              margin="normal"
              required
              defaultValue={email}
            ></TextField>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              defaultValue={password}
            ></TextField>
            <div className="login-buttons">
              <button
                className="sign-in"
                onClick={() => {
                  signIn();
                }}
              >
                SIGN IN
              </button>
              <button
                className="sign-in"
                onClick={() => {
                  signUp();
                }}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Login;
