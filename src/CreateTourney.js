import React from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  updateTournament,
  updateTournaments,
  updateIds,
} from "./redux/actions/actions";
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
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import MuiPhoneNumber from "material-ui-phone-number";

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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  details: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  dropdown: {
    marginLeft: theme.spacing(-1),
  },
  bar: {
    marginTop: theme.spacing(4),
  },
}));

const CreateTourney = (props) => {
  const { user, db, updateCreateToggle, setEditable, editable } = props;

  // Generate a new UUID
  const id = uuidv4();

  const admin = user.uid;

  const classes = useStyles();
  const dispatch = useDispatch();

  const { tournament, tournaments, ids } = useSelector((state) => ({
    tournament: state.pickleball.tournament,
    tournaments: state.pickleball.tournaments,
    ids: state.pickleball.ids,
  }));
  const editableTourney = tournaments.filter((t) => t.id === editable)[0];

  let title = tournament.title;
  let date = tournament.date;
  let time = tournament.time;
  let venue = tournament.venue;
  let inOrOut = tournament.inOrOut;
  let courts = tournament.courts;
  let gender = tournament.gender;
  let minAge = tournament.minAge;
  let skill = tournament.skill;
  let type = tournament.type;
  let fee = tournament.fee;
  let open = tournament.open;
  let deadline = tournament.deadline;
  let contact = tournament.contact;
  let phone = tournament.phone;
  let organizer = tournament.organizer;
  let details = tournament.details;
  let participants = tournament.participants;
  let maxPlayers = tournament.maxPlayers;
  let address = tournament.address;
  let city = tournament.city;
  let state = tournament.state;
  let zipcode = tournament.zipcode;

  async function createTourney(
    title,
    date,
    time,
    venue,
    address,
    city,
    state,
    zipcode,
    inOrOut,
    courts,
    gender,
    minAge,
    skill,
    type,
    fee,
    open,
    deadline,
    contact,
    phone,
    organizer,
    details,
    id,
    admin,
    user,
    participants,
    maxPlayers
  ) {
    try {
      const querySnapshot = await db.collection("tournaments").get();
      if (type === "Modified") {
        if (courts === 2) maxPlayers = 11;
        if (courts === 3) maxPlayers = 15;
        if (courts === 4) maxPlayers = 19;
        if (courts === 5) maxPlayers = 23;
        if (courts === 6) maxPlayers = 27;
        if (courts === 7) maxPlayers = 31;
        if (courts === 8) maxPlayers = 35;
      }
      tournaments.push({
        title: title,
        date: date,
        time: time,
        venue: venue,
        address: address,
        city: city,
        state: state,
        zipcode: zipcode,
        inOrOut: inOrOut,
        courts: courts,
        gender: gender,
        minAge: minAge,
        skill: skill,
        type: type,
        fee: fee,
        open: open,
        deadline: deadline,
        contact: contact,
        organizer: organizer,
        phone: phone,
        details: details,
        admin: user.uid,
        id: id,
        participants: [],
        maxPlayers: type === "Full" ? courts * 4 : maxPlayers,
      });
      if (
        title === "" ||
        date === "2020-05-20" ||
        open === "2020-05-20" ||
        deadline === "2020-05-20" ||
        time === "00:00" ||
        venue === "" ||
        address === "" ||
        city === "" ||
        state === "" ||
        zipcode === "" ||
        organizer === ""
      ) {
        window.alert("Please fill out all required fields.");
      } else {
        querySnapshot.docs[0].ref.update({
          tournaments: tournaments,
        });
        window.alert("Tournament creation successful!");
        updateCreateToggle(false);
      }
    } catch (error) {
      window.alert("Error creating tournament.");
      console.log("Error creating tournament", error);
    }
  }

  async function createID(id) {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();

      querySnapshot.docs[0].ref.update({
        ids: firebase.firestore.FieldValue.arrayUnion(id),
      });
    } catch (error) {
      console.log("Error creating ID", error);
    }
  }

  async function editTourney(
    title,
    date,
    time,
    venue,
    address,
    city,
    state,
    zipcode,
    inOrOut,
    courts,
    gender,
    minAge,
    skill,
    type,
    fee,
    open,
    deadline,
    contact,
    phone,
    organizer,
    details,
    id,
    user
  ) {
    try {
      const querySnapshot = await db.collection("tournaments").get();
      for (let i in tournaments) {
        if (editable === tournaments[i].id) {
          if (title) tournaments[i].title = title;
          if (date) tournaments[i].date = date;
          if (time) tournaments[i].time = time;
          if (venue) tournaments[i].venue = venue;
          if (address) tournaments[i].address = address;
          if (city) tournaments[i].city = city;
          if (state) tournaments[i].state = state;
          if (zipcode) tournaments[i].zipcode = zipcode;
          if (inOrOut) tournaments[i].inOrOut = inOrOut;
          if (courts) tournaments[i].courts = courts;
          if (type && type === "Full") {
            tournaments[i].type = type;
            tournaments[i].maxPlayers = courts
              ? courts * 4
              : tournaments[i].courts * 4;
          }
          if (type && type === "Modified") {
            tournaments[i].type = type;
            if (courts) {
              if (courts === 2) tournaments[i].maxPlayers = 11;
              if (courts === 3) tournaments[i].maxPlayers = 15;
              if (courts === 4) tournaments[i].maxPlayers = 19;
              if (courts === 5) tournaments[i].maxPlayers = 23;
              if (courts === 6) tournaments[i].maxPlayers = 27;
              if (courts === 7) tournaments[i].maxPlayers = 31;
              if (courts === 8) tournaments[i].maxPlayers = 35;
            } else {
              if (tournaments[i].courts === 2) tournaments[i].maxPlayers = 11;
              if (tournaments[i].courts === 3) tournaments[i].maxPlayers = 15;
              if (tournaments[i].courts === 4) tournaments[i].maxPlayers = 19;
              if (tournaments[i].courts === 5) tournaments[i].maxPlayers = 23;
              if (tournaments[i].courts === 6) tournaments[i].maxPlayers = 27;
              if (tournaments[i].courts === 7) tournaments[i].maxPlayers = 31;
              if (tournaments[i].courts === 8) tournaments[i].maxPlayers = 35;
            }
          }
          if (gender) tournaments[i].gender = gender;
          if (minAge) tournaments[i].minAge = minAge;
          if (skill) tournaments[i].skill = skill;
          if (fee) tournaments[i].fee = fee;
          if (open) tournaments[i].open = open;
          if (deadline) tournaments[i].deadline = deadline;
          if (contact) tournaments[i].contact = contact;
          if (phone) tournaments[i].phone = phone;
          if (organizer) tournaments[i].organizer = organizer;
          if (details) tournaments[i].details = details;

          querySnapshot.docs[0].ref.update({
            tournaments: tournaments,
          });
          window.alert("Tournament update successful!");
          setEditable(null);
        }
      }
    } catch (error) {
      window.alert("Error updating tournament.");
      console.log("Error updating tournament", error);
    }
  }

  return (
    <React.Fragment>
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
            defaultValue={
              editableTourney ? editableTourney.title : tournament.title
            }
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            id="date"
            label="Date"
            type="date"
            variant="outlined"
            margin="normal"
            required
            defaultValue={
              editableTourney ? editableTourney.date : tournament.date
            }
            onChange={(e) =>
              dispatch(updateTournament({ date: e.target.value }))
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            id="time"
            label="Time"
            type="time"
            variant="outlined"
            margin="normal"
            required
            defaultValue={
              editableTourney ? editableTourney.time : tournament.time
            }
            onChange={(e) =>
              dispatch(updateTournament({ time: e.target.value }))
            }
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.venue : tournament.venue
            }
            label="Venue Name"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ venue: e.target.value }));
            }}
            margin="normal"
            required
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.address : tournament.address
            }
            label="Street Address"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ address: e.target.value }));
            }}
            margin="normal"
            required
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.city : tournament.city
            }
            label="City"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ city: e.target.value }));
            }}
            margin="normal"
            required
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.state : tournament.state
            }
            label="State"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ state: e.target.value }));
            }}
            margin="normal"
            required
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.zipcode : tournament.zipcode
            }
            label="Zipcode"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ zipcode: e.target.value }));
            }}
            margin="normal"
            required
          ></TextField>
        </FormControl>
        <FormControl
          variant="outlined"
          className={`create-tournament ${classes.formControl}`}
        >
          <InputLabel id="demo-simple-select-outlined-label">
            Indoor or Outdoor
          </InputLabel>
          <Select
            className={`create-tournament ${classes.selectEmpty} ${classes.dropdown}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) =>
              dispatch(updateTournament({ inOrOut: e.target.value }))
            }
            label="Indoor or Outdoor"
            variant="outlined"
            value={editableTourney ? editableTourney.inOrOut : inOrOut}
          >
            <MenuItem value={"Indoor"}>Indoor</MenuItem>
            <MenuItem value={"Outdoor"}>Outdoor</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          className={`create-tournament ${classes.formControl}`}
        >
          <InputLabel id="demo-simple-select-outlined-label">
            Round-Robin Type
          </InputLabel>
          <Select
            className={`create-tournament ${classes.selectEmpty} ${classes.dropdown}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) =>
              dispatch(updateTournament({ type: e.target.value }))
            }
            label="Round-Robin Type"
            variant="outlined"
            value={editableTourney ? editableTourney.type : type}
          >
            <MenuItem value={"Modified"}>Modified</MenuItem>
            <MenuItem value={"Full"}>Full</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={`create-tournament ${classes.slider}`}>
          <Typography id="discrete-slider" gutterBottom color="textPrimary">
            Number of Courts
          </Typography>
          <Slider
            className={classes.bar}
            value={editableTourney ? editableTourney.courts : courts}
            aria-labelledby="discrete-slider-restrict"
            step={1}
            marks
            min={type === "Full" ? 1 : 2}
            max={type === "Full" ? 4 : 8}
            valueLabelDisplay="on"
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
            className={`create-tournament ${classes.selectEmpty} ${classes.dropdown}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            required
            onChange={(e) =>
              dispatch(updateTournament({ gender: e.target.value }))
            }
            label="Gender"
            variant="outlined"
            value={editableTourney ? editableTourney.gender : gender}
          >
            <MenuItem value={"Mens"}>Mens</MenuItem>
            <MenuItem value={"Womens"}>Womens</MenuItem>
            <MenuItem value={"Mixed"}>Mixed</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.minAge : tournament.minAge
            }
            label="Minimum Age"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ minAge: e.target.value }));
            }}
            margin="normal"
          ></TextField>
        </FormControl>
        <FormControl className={`create-tournament ${classes.slider}`}>
          <Typography id="range-slider" gutterBottom color="textPrimary">
            Skill Levels
          </Typography>
          <Slider
            className={classes.bar}
            value={editableTourney ? editableTourney.skill : skill}
            aria-labelledby="range-slider"
            step={0.5}
            marks
            min={0}
            max={6}
            valueLabelDisplay="on"
            onChange={(event, value) =>
              dispatch(updateTournament({ skill: value }))
            }
            required
          />
        </FormControl>

        <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-amount">
            Registration Fee
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            defaultValue={
              editableTourney ? editableTourney.fee : tournament.fee
            }
            onChange={(e) =>
              dispatch(updateTournament({ fee: e.target.value }))
            }
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            labelWidth={120}
            className={classes.dropdown}
          />
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            id="date"
            label="Registration Start"
            type="date"
            variant="outlined"
            margin="normal"
            required
            defaultValue={
              editableTourney ? editableTourney.open : tournament.open
            }
            onChange={(e) =>
              dispatch(updateTournament({ open: e.target.value }))
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            id="date"
            label="Registration End"
            type="date"
            variant="outlined"
            margin="normal"
            required
            defaultValue={
              editableTourney ? editableTourney.deadline : tournament.deadline
            }
            onChange={(e) =>
              dispatch(updateTournament({ deadline: e.target.value }))
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.organizer : tournament.organizer
            }
            label="Orgainizer Name"
            variant="outlined"
            required
            onChange={(e) => {
              dispatch(updateTournament({ organizer: e.target.value }));
            }}
            margin="normal"
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.contact : tournament.contact
            }
            label="Contact Email"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ contact: e.target.value }));
            }}
            margin="normal"
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <MuiPhoneNumber
            variant="outlined"
            defaultCountry={"us"}
            onChange={(value) => dispatch(updateTournament({ phone: value }))}
            label="Contact Phone"
            value={editableTourney ? editableTourney.phone : phone}
            margin="normal"
          />
        </FormControl>

        <FormControl className={`create-tournament ${classes.details}`}>
          <TextField
            defaultValue={
              editableTourney ? editableTourney.details : tournament.details
            }
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
          {editable ? (
            <Button
              className={classes.button}
              onClick={() => {
                editTourney(
                  title,
                  date,
                  time,
                  venue,
                  address,
                  city,
                  state,
                  zipcode,
                  inOrOut,
                  courts,
                  gender,
                  minAge,
                  skill,
                  type,
                  fee,
                  open,
                  deadline,
                  contact,
                  phone,
                  organizer,
                  details,
                  id,
                  user,
                  maxPlayers
                );
                dispatch(updateTournaments([...tournaments, ...[tournament]]));
              }}
              variant="contained"
              color="primary"
            >
              Update Tournament
            </Button>
          ) : (
            <Button
              className={classes.button}
              onClick={() => {
                createTourney(
                  title,
                  date,
                  time,
                  venue,
                  address,
                  city,
                  state,
                  zipcode,
                  inOrOut,
                  courts,
                  gender,
                  minAge,
                  skill,
                  type,
                  fee,
                  open,
                  deadline,
                  contact,
                  phone,
                  organizer,
                  details,
                  id,
                  admin,
                  user,
                  participants,
                  maxPlayers
                );
                dispatch(updateTournaments([...tournaments, ...[tournament]]));
                createID(id);
                dispatch(updateIds([...ids, ...[id]]));
              }}
              variant="contained"
              color="primary"
            >
              Create Tournament
            </Button>
          )}
          <Button
            onClick={() => {
              updateCreateToggle(false);
              setEditable(null);
            }}
            variant="contained"
            color="primary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateTourney;
