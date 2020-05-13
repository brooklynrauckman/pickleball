import React, { useState, useEffect } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Tourneys from "./Tourneys.js";
import { v4 as uuidv4 } from "uuid";
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

const CreateTourney = (props) => {
  const {
    user,
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
  } = props;

  // Generate a new UUID
  const id = uuidv4();

  const classes = useStyles();

  async function createTourney(
    title,
    deadline,
    date,
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
      tempList.push({
        title: title,
        deadline: deadline.format("MMMM d, YYYY"),
        date: date.format("MMMM d, YYYY"),
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
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        ></TextField>
      </FormControl>
      <FormControl className="create-tournament">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            onChange={setDate}
            value={date}
            inputVariant="outlined"
            label="Date & Time"
            margin="normal"
            required
          />
        </MuiPickersUtilsProvider>
      </FormControl>
      <FormControl className="create-tournament">
        <TextField
          label="Tournament Venue"
          variant="outlined"
          onChange={(e) => {
            setVenue(e.target.value);
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
          defaultValue={1}
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
        <InputLabel id="demo-simple-select-outlined-label">Gender</InputLabel>
        <Select
          className={`create-tournament ${classes.selectEmpty}`}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          label="Gender"
          variant="outlined"
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
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          labelWidth={120}
        />
      </FormControl>
      <FormControl className="create-tournament">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DateTimePicker
            value={deadline}
            onChange={setDeadline}
            inputVariant="outlined"
            label="Registration Deadline"
            margin="normal"
            required
          />
        </MuiPickersUtilsProvider>
      </FormControl>
      <FormControl className="create-tournament">
        <TextField
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
          label="Contact Phone/Email"
          variant="outlined"
          onChange={(e) => {
            setContact(e.target.value);
          }}
          margin="normal"
        ></TextField>
      </FormControl>
      <FormControl className={`create-tournament ${classes.details}`}>
        <TextField
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
          createTourney(
            title,
            deadline,
            date,
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
        Create Tournament
      </Button>
    </div>
  );
};

export default CreateTourney;
