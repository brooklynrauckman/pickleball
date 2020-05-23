import React from "react";
import "./App.css";
import "firebase/firestore";
import "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { updateAccount } from "./redux/actions/actions";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Slider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  details: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
  bar: {
    marginTop: theme.spacing(4),
  },
  dropdown: {
    marginLeft: theme.spacing(-1),
  },
}));

const SetUp = (props) => {
  const { user, db, updateSetUpToggle } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const { account } = useSelector((state) => ({
    account: state.pickleball.account,
  }));

  let name = account.name;
  let phone = account.phone;
  let zipcode = account.zipcode;
  let birthdate = account.birthdate;
  let skill = account.skill;
  let gender = account.gender;

  async function editAccount(name, phone, zipcode, birthdate, skill, gender) {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();
      if (name) account.name = name;
      if (phone) account.phone = phone;
      if (zipcode) account.zipcode = zipcode;
      if (birthdate) account.birthdate = birthdate;
      if (skill) account.skill = skill;
      if (gender) account.gender = gender;

      querySnapshot.docs[0].ref.update({
        account: account,
      });
      window.alert("Account update successful!");
      updateSetUpToggle(false);
    } catch (error) {
      window.alert("Error updating account.");
      console.log("Error updating account", error);
    }
  }

  return (
    <div className="account-form">
      <FormControl className="create-tournament">
        <TextField
          label="Name"
          variant="outlined"
          onChange={(e) => dispatch(updateAccount({ name: e.target.value }))}
          margin="normal"
          required
          defaultValue={name}
        ></TextField>
      </FormControl>

      <FormControl className="create-tournament">
        <MuiPhoneNumber
          variant="outlined"
          defaultCountry={"us"}
          onChange={(value) => dispatch(updateAccount({ phone: value }))}
          label="Phone Number"
          value={phone}
          margin="normal"
        />
      </FormControl>
      <FormControl className="create-tournament">
        <TextField
          label="Zipcode"
          variant="outlined"
          onChange={(e) => dispatch(updateAccount({ zipcode: e.target.value }))}
          margin="normal"
          defaultValue={zipcode}
        ></TextField>
      </FormControl>
      <FormControl className="create-tournament">
        <TextField
          id="date"
          label="Birthdate"
          type="date"
          variant="outlined"
          margin="normal"
          defaultValue={birthdate}
          onChange={(e) =>
            dispatch(updateAccount({ birthdate: e.target.value }))
          }
          InputLabelProps={{
            shrink: true,
          }}
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
          onChange={(e) => dispatch(updateAccount({ gender: e.target.value }))}
          label="Gender"
          variant="outlined"
          value={gender}
        >
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={`create-tournament ${classes.slider}`}>
        <Typography id="discrete-slider" gutterBottom color="textPrimary">
          Skill Level
        </Typography>
        <Slider
          className={classes.bar}
          value={skill}
          aria-labelledby="discrete-slider-restrict"
          step={0.5}
          min={0}
          max={6}
          marks
          valueLabelDisplay="on"
          onChange={(event, value) => dispatch(updateAccount({ skill: value }))}
        />
      </FormControl>

      <div className="create-buttons">
        <Button
          className={classes.button}
          onClick={() => {
            editAccount(name, phone, zipcode, birthdate, skill, gender);
          }}
          variant="contained"
          color="primary"
        >
          Update Account
        </Button>
        <Button
          onClick={() => {
            updateSetUpToggle(false);
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

export default SetUp;
