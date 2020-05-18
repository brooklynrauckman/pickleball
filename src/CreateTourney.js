import React from "react";
import "./App.css";
import "firebase/firestore";
import "firebase/auth";
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
  const { user, db, updateCreateToggle, setEditable, editable } = props;

  // Generate a new UUID
  const id = uuidv4();

  const admin = user.uid;

  const classes = useStyles();
  const dispatch = useDispatch();

  const { tournament, tournaments } = useSelector((state) => ({
    tournament: state.pickleball.tournament,
    tournaments: state.pickleball.tournaments,
  }));
  const editableTourney = tournaments.filter((t) => t.id === editable)[0];

  let title = tournament.title;
  let date = tournament.date;
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
  let organizer = tournament.organizer;
  let details = tournament.details;
  let participants = tournament.participants;

  async function createTourney(
    title,
    date,
    venue,
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
    organizer,
    details,
    id,
    admin,
    user,
    participants
  ) {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();
      tournaments.push({
        title: title,
        date: date ? date.toISOString() : new Date().toISOString(),
        venue: venue,
        inOrOut: inOrOut ? inOrOut : "",
        courts: courts,
        gender: gender ? gender : "Mixed",
        minAge: minAge ? minAge : 0,
        skill: skill ? skill : ["1", "2", "3", "4", "5"],
        type: type ? type : "Modified",
        fee: fee ? fee : 0,
        open: open ? open.toISOString() : new Date().toISOString(),
        deadline: deadline ? deadline.toISOString() : new Date().toISOString(),
        contact: contact ? contact : "",
        organizer: organizer ? organizer : "",
        details: details ? details : "",
        admin: user.uid,
        id: id,
        participants: [],
      });

      querySnapshot.docs[0].ref.update({
        tournaments: tournaments,
      });

      window.alert("Tournament creation successful!");
    } catch (error) {
      window.alert("Error creating tournament.");
      console.log("Error creating tournament", error);
    }
  }

  async function editTourney(
    title,
    date,
    venue,
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
      for (let i in tournaments) {
        if (editable === tournaments[i].id) {
          if (title) tournaments[i].title = title;
          if (date) tournaments[i].date = date.toISOString();
          if (venue) tournaments[i].venue = venue;
          if (inOrOut) tournaments[i].inOrOut = inOrOut;
          if (courts) tournaments[i].courts = courts;
          if (gender) tournaments[i].gender = gender;
          if (minAge) tournaments[i].minAge = minAge;
          if (skill) tournaments[i].skill = skill;
          if (type) tournaments[i].type = type;
          if (fee) tournaments[i].fee = fee;
          if (open) tournaments[i].open = open.toISOString();
          if (deadline) tournaments[i].deadline = deadline.toISOString();
          if (contact) tournaments[i].contact = contact;
          if (organizer) tournaments[i].organizer = organizer;
          if (details) tournaments[i].details = details;
          console.log("EDITINO TORNA", tournaments);
          querySnapshot.docs[0].ref.update({
            tournaments: tournaments,
          });
          window.alert("Tournament update successful!");
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
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              value={date}
              onChange={(value) => dispatch(updateTournament({ date: value }))}
              inputVariant="outlined"
              label="Date & Time"
              margin="normal"
              required
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.venue : tournament.venue
            }
            label="Tournament Venue"
            variant="outlined"
            onChange={(e) => {
              dispatch(updateTournament({ venue: e.target.value }));
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
            className={`create-tournament ${classes.selectEmpty}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) =>
              dispatch(updateTournament({ inOrOut: e.target.value }))
            }
            label="Indoor or Outdoor"
            variant="outlined"
            value={inOrOut}
          >
            <MenuItem value={"Indoor"}>Indoor</MenuItem>
            <MenuItem value={"Outdoor"}>Outdoor</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={`create-tournament ${classes.slider}`}>
          <Typography id="discrete-slider" gutterBottom color="textPrimary">
            Number of Courts
          </Typography>
          <Slider
            value={courts}
            aria-labelledby="discrete-slider-restrict"
            step={1}
            marks
            min={1}
            max={8}
            valueLabelDisplay="auto"
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
            onChange={(e) =>
              dispatch(updateTournament({ gender: e.target.value }))
            }
            label="Gender"
            variant="outlined"
            value={gender}
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
        <FormControl
          variant="outlined"
          className={`create-tournament ${classes.formControl}`}
        >
          <InputLabel id="demo-simple-select-outlined-label">
            Skill Level(s)
          </InputLabel>
          <Select
            className={`create-tournament ${classes.selectEmpty}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) =>
              dispatch(updateTournament({ skill: e.target.value }))
            }
            label="Skill Level(s)"
            variant="outlined"
            value={skill}
            multiple
          >
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
            <MenuItem value={"4"}>4</MenuItem>
            <MenuItem value={"5"}>5</MenuItem>
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
            className={`create-tournament ${classes.selectEmpty}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) =>
              dispatch(updateTournament({ type: e.target.value }))
            }
            label="Round-Robin Type"
            variant="outlined"
            value={type}
          >
            <MenuItem value={"Modified"}>Modified</MenuItem>
            <MenuItem value={"Full"}>Full</MenuItem>
          </Select>
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
          />
        </FormControl>
        <FormControl className="create-tournament">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              value={open}
              onChange={(value) => dispatch(updateTournament({ open: value }))}
              inputVariant="outlined"
              label="Registration Start"
              margin="normal"
              required
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className="create-tournament">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              value={deadline}
              onChange={(value) =>
                dispatch(updateTournament({ deadline: value }))
              }
              inputVariant="outlined"
              label="Registration End"
              margin="normal"
              required
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            defaultValue={
              editableTourney ? editableTourney.organizer : tournament.organizer
            }
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
            defaultValue={
              editableTourney ? editableTourney.contact : tournament.contact
            }
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
                  venue,
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
              Update Tournament
            </Button>
          ) : (
            <Button
              className={classes.button}
              onClick={() => {
                createTourney(
                  title,
                  date,
                  venue,
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
                  organizer,
                  details,
                  id,
                  admin,
                  user,
                  participants
                );
                dispatch(updateTournaments([...tournaments, ...[tournament]]));
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
