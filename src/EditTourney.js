import React, { useState, useEffect } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Tourneys from "./Tourneys.js";
import { useHistory } from "react-router-dom";

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
}));

const EditTourney = (props) => {
  const {
    user,
    id,
    setTitle,
    setDate,
    setVenue,
    setTime,
    setCourts,
    setDeadline,
    title,
    date,
    venue,
    deadline,
    courts,
    gender,
    setGender,
    fee,
    setFee,
    contact,
    setContact,
    organizer,
    setOrganizer,
    details,
    setDetails,
    isOpen,
    setIsOpen,
    db,
    tournaments,
  } = props;

  const classes = useStyles();

  let history = useHistory();

  async function editTourney(
    id,
    title,
    venue,
    courts,
    gender,
    fee,
    contact,
    organizer,
    details
  ) {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();
      const tempList = querySnapshot.docs[0].get("tournaments");

      for (let t in tempList) {
        if (isOpen.toString() === t) {
          tempList[t].title = title;
          tempList[t].venue = venue;
          tempList[t].courts = courts;
          tempList[t].genfer = gender;
          tempList[t].fee = fee;
          tempList[t].contact = contact;
          tempList[t].organizer = organizer;
          tempList[t].details = details;
          querySnapshot.docs[0].ref.update({
            tournaments: tempList,
          });
          window.alert("Tournament update successful!");
          history.push("/tourneys");
          setIsOpen(null);
        }
      }
    } catch (error) {
      window.alert("Error updating tournament.");
      console.log("Error updating tournament", error);
    }
  }

  return (
    <div className="create-form">
      {tournaments.length
        ? tournaments.map((tournament, index) => (
            <React.Fragment key={index}>
              {isOpen == index ? (
                <React.Fragment>
                  <FormControl className="create-tournament">
                    <TextField
                      label="Tournament Title"
                      variant="outlined"
                      onChange={(e) => setTitle(e.target.value)}
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
                        setVenue(e.target.value);
                      }}
                      margin="normal"
                      required
                    ></TextField>
                  </FormControl>
                  <FormControl
                    className={`create-tournament ${classes.slider}`}
                  >
                    <Typography
                      id="discrete-slider"
                      gutterBottom
                      color="textPrimary"
                    >
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
                      onChange={(event, value) => setCourts(value)}
                      required
                    />
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={`create-tournament ${classes.formControl}`}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Gender
                    </InputLabel>
                    <Select
                      className={`create-tournament ${classes.selectEmpty}`}
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
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
                  <FormControl
                    fullWidth
                    className={classes.margin}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Registration Fee
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      defaultValue={tournament.fee}
                      onChange={(e) => setFee(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      labelWidth={120}
                    />
                  </FormControl>
                  <FormControl className="create-tournament">
                    <TextField
                      defaultValue={tournament.organizer}
                      label="Orgainizer Name"
                      variant="outlined"
                      onChange={(e) => {
                        setOrganizer(e.target.value);
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
                        setContact(e.target.value);
                      }}
                      margin="normal"
                    ></TextField>
                  </FormControl>
                  <FormControl
                    className={`create-tournament ${classes.details}`}
                  >
                    <TextField
                      defaultValue={tournament.details}
                      label="Details"
                      variant="outlined"
                      onChange={(e) => {
                        setDetails(e.target.value);
                      }}
                      margin="normal"
                      multiline
                    ></TextField>
                  </FormControl>
                  <Button
                    onClick={() => {
                      editTourney(
                        id,
                        title,
                        venue,
                        courts,
                        gender,
                        fee,
                        contact,
                        organizer,
                        details
                      );
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Update Tournament
                  </Button>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ))
        : ""}
    </div>
  );
};

export default EditTourney;
