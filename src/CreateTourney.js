import React, { useState, useEffect } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Tourneys from "./Tourneys.js";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTournament, updateTournaments } from "./redux/actions/actions";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Typography,
  Slider,
} from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginBottom: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
  slider: {
    marginTop: theme.spacing(2),
  },
  details: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const CreateTourney = (props) => {
  const { user, db, updateCreateToggle } = props;

  // Generate a new UUID
  const id = uuidv4();

  const classes = useStyles();
  let history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();

  const { tournament, tournaments } = useSelector((state) => ({
    tournament: state.pickleball.tournament,
    tournaments: state.pickleball.tournaments,
    test: state,
  }));

  let title = tournament.title;
  let venue = tournament.venue;
  let courts = tournament.courts;
  let gender = tournament.gender;
  let fee = tournament.fee;
  let contact = tournament.contact;
  let organizer = tournament.organizer;
  let details = tournament.details;

  async function createTourney(
    title,
    venue,
    courts,
    gender,
    fee,
    contact,
    organizer,
    details,
    id,
    user
  ) {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();
      const tempList = querySnapshot.docs[0].get("tournaments");
      tempList.push({
        title: title,
        venue: venue,
        courts: courts,
        gender: gender,
        fee: fee,
        contact: contact,
        organizer: organizer,
        details: details,
        admin: user.uid,
        id: id,
      });
      if (!title || !venue || !courts) {
        window.alert("Please, fill out all of the required fields.");
      } else {
        querySnapshot.docs[0].ref.update({
          tournaments: tempList,
        });
        window.alert("Tournament creation successful!");
      }
    } catch (error) {
      window.alert("Error creating tournament.");
      console.log("Error creating tournament", error);
    }
  }
  return (
    <div className="create-form">
      <FormControl className="create-tournament">
        <TextField
          label="Tournament Title"
          variant="outlined"
          onChange={(e) =>
            dispatch(updateTournament({ title: e.target.value }))
          }
          margin="normal"
          required
          defaultValue={tournament.title}
        ></TextField>
      </FormControl>
      <FormControl className="create-tournament">
        <TextField
          defaultValue={tournament.venue}
          label="Tournament Venue"
          variant="outlined"
          onChange={(e) => {
            dispatch(updateTournament({ venue: e.target.value }));
          }}
          margin="normal"
          required
        ></TextField>
      </FormControl>
      <FormControl className={`create-tournament ${classes.slider}`}>
        <Typography id="discrete-slider" gutterBottom color="textPrimary">
          Number of Courts
        </Typography>
        <Slider
          defaultValue={tournament.courts}
          aria-labelledby="discrete-slider-restrict"
          step={1}
          marks
          min={1}
          max={8}
          valueLabelDisplay="auto"
          value={courts}
          onChange={(event, value) =>
            dispatch(updateTournament({ courts: value }))
          }
          required
        />
      </FormControl>
      <FormControl
        variant="outlined"
        className={`create-tournament ${classes.formControl}`}
      >
        <InputLabel id="demo-simple-select-outlined-label">Gender</InputLabel>
        <Select
          className={`create-tournament ${classes.selectEmpty}`}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={gender}
          onChange={(e) =>
            dispatch(updateTournament({ gender: e.target.value }))
          }
          label="Gender"
          variant="outlined"
          defaultValue={tournament.gender}
        >
          <MenuItem value={""}>
            <em>None</em>
          </MenuItem>
          <MenuItem value={"Mens"}>Mens</MenuItem>
          <MenuItem value={"Womens"}>Womens</MenuItem>
          <MenuItem value={"Mixed"}>Mixed</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth className={classes.margin} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-amount">
          Registration Fee
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          defaultValue={tournament.fee}
          onChange={(e) => dispatch(updateTournament({ fee: e.target.value }))}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          labelWidth={120}
        />
      </FormControl>
      <FormControl className="create-tournament">
        <TextField
          defaultValue={tournament.organizer}
          label="Orgainizer Name"
          variant="outlined"
          onChange={(e) => {
            dispatch(updateTournament({ organizer: e.target.value }));
          }}
          margin="normal"
        ></TextField>
      </FormControl>
      <FormControl className="create-tournament">
        <TextField
          defaultValue={tournament.contact}
          label="Contact Phone/Email"
          variant="outlined"
          onChange={(e) => {
            dispatch(updateTournament({ contact: e.target.value }));
          }}
          margin="normal"
        ></TextField>
      </FormControl>
      <FormControl className={`create-tournament ${classes.details}`}>
        <TextField
          defaultValue={tournament.details}
          label="Details"
          variant="outlined"
          onChange={(e) => {
            dispatch(updateTournament({ details: e.target.value }));
          }}
          margin="normal"
          multiline
        ></TextField>
      </FormControl>
      <div className="create-buttons">
        <Button
          className={classes.button}
          onClick={() => {
            createTourney(
              title,
              venue,
              courts,
              gender,
              fee,
              contact,
              organizer,
              details,
              id,
              user
            );
            dispatch(updateTournaments([...tournaments, ...[tournament]]));
          }}
          variant="contained"
          color="primary"
        >
          Create Tournament
        </Button>
        <Button
          onClick={() => {
            updateCreateToggle(false);
          }}
          variant="contained"
          color="primary"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreateTourney;
