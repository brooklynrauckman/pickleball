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
  OutlinedInput,
} from "@material-ui/core";
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
  button: {
    marginRight: theme.spacing(2),
  },
}));

const SetUp = (props) => {
  const { user, db, updateSetUpToggle, setUp } = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const { account } = useSelector((state) => ({
    account: state.pickleball.account,
  }));

  let name = account.name;
  let email = account.email;
  let phone = account.phone;
  let zipcode = account.zipcode;
  let birthdate = account.birthdate;
  let skill = account.skill;
  let gender = account.gender;

  async function createAccount(
    name,
    email,
    phone,
    zipcode,
    birthdate,
    skill,
    gender
  ) {
    try {
      const querySnapshot = await db
        .collection("users")
        .where("userId", "==", user.uid)
        .get();

      querySnapshot.docs[0].ref.update({
        account: {
          name: name,
          email: email,
          phone: phone,
          zipcode: zipcode,
          birthdate: birthdate,
          skill: skill,
          gender: gender,
        },
      });
      window.alert("Account update successful!");
      console.log("Account update successful", account);
    } catch (error) {
      window.alert("Error creating account.");
      console.log("Error creating account", error);
    }
  }

  return (
    <React.Fragment>
      <div className="account-form">
        <FormControl className="create-tournament">
          <TextField
            label="Name"
            variant="outlined"
            onChange={(e) => dispatch(updateAccount({ name: e.target.value }))}
            margin="normal"
            required
            defaultValue={account.name ? account.name : name}
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            label="Email"
            variant="outlined"
            onChange={(e) => dispatch(updateAccount({ email: e.target.value }))}
            margin="normal"
            required
            defaultValue={account.email ? account.email : email}
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            label="Phone"
            variant="outlined"
            onChange={(e) => dispatch(updateAccount({ phone: e.target.value }))}
            margin="normal"
            required
            defaultValue={account.phone ? account.phone : phone}
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            label="Zipcode"
            variant="outlined"
            onChange={(e) =>
              dispatch(updateAccount({ zipcode: e.target.value }))
            }
            margin="normal"
            required
            defaultValue={account.zipcode ? account.zipcode : zipcode}
          ></TextField>
        </FormControl>
        <FormControl className="create-tournament">
          <TextField
            id="date"
            label="Birthdate"
            type="date"
            variant="outlined"
            margin="normal"
            defaultValue={account.birthdate ? account.birthdate : birthdate}
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
            className={`create-tournament ${classes.selectEmpty}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) =>
              dispatch(updateAccount({ gender: e.target.value }))
            }
            label="Gender"
            variant="outlined"
            value={account.gender ? account.gender : gender}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          className={`create-tournament ${classes.formControl}`}
        >
          <InputLabel id="demo-simple-select-outlined-label">
            Skill Level
          </InputLabel>
          <Select
            className={`create-tournament ${classes.selectEmpty}`}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={(e) => dispatch(updateAccount({ skill: e.target.value }))}
            label="Skill Level(s)"
            variant="outlined"
            value={account.skill ? account.skill : skill}
          >
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2"}>2</MenuItem>
            <MenuItem value={"3"}>3</MenuItem>
            <MenuItem value={"4"}>4</MenuItem>
            <MenuItem value={"5"}>5</MenuItem>
          </Select>
        </FormControl>
        <div className="create-buttons">
          <Button
            className={classes.button}
            onClick={() => {
              createAccount(
                name,
                email,
                phone,
                zipcode,
                birthdate,
                skill,
                gender
              );
            }}
            variant="contained"
            color="primary"
          >
            {setUp ? "Update Account" : "Create Account"}
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
    </React.Fragment>
  );
};

export default SetUp;
