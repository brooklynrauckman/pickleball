import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector, useDispatch } from "react-redux";
import { updateTournaments } from "./redux/actions/actions";
import CreateTourney from "./CreateTourney.js";
import Header from "./Header.js";
import Blur from "./Blur.js";

const Tourneys = (props) => {
  const { user, setUser, db } = props;
  const [editable, setEditable] = useState(null);
  const [createToggle, updateCreateToggle] = useState(false);

  const dispatch = useDispatch();

  const { tournaments } = useSelector((state) => ({
    tournaments: state.pickleball.tournaments,
  }));

  useEffect(() => {
    if (createToggle) {
      document.querySelector("body").style.overflowY = "hidden";
    } else {
      document.querySelector("body").style.overflowY = "auto";
    }
  }, [createToggle]);

  const [value] = useCollection(
    firebase
      .firestore()
      .collection("users")
      .where("userId", "==", user ? user.uid : "")
  );

  async function deleteTourneys(tournament) {
    const querySnapshot = await value.docs[0].get("tournaments");
    const updatedArray = querySnapshot.filter((t) => {
      if (t.id !== tournament.id) {
        return t;
      }
    });
    const c = window.confirm(
      "Press OK to confirm you want to delete this tournament."
    );

    if (c === true) {
      value.docs[0].ref.update({
        tournaments: updatedArray,
      });
    } else {
      console.log("Delete Canceled");
    }
  }

  useEffect(() => {
    async function getTourneys() {
      // we assume there is only 1 result so hardcode the [0]
      const fetchedTourneys = await value.docs[0].get("tournaments");
      if (fetchedTourneys) {
        const newFetchedTourneys = fetchedTourneys.map((tournament) => {
          let formatDate = new Date(tournament.date);
          let dayDate = formatDate.getDate();
          let monthDate = formatDate.getMonth() + 1;
          let yearDate = formatDate.getFullYear();
          let hoursDate = formatDate.getHours();
          let minsDate = formatDate.getMinutes();
          let amOrPmDate;
          if (hoursDate > 12) {
            hoursDate = hoursDate - 12;
            amOrPmDate = "PM";
          } else if (hoursDate < 12) {
            amOrPmDate = "AM";
          } else if ((hoursDate = 12)) {
            amOrPmDate = "PM";
          }
          if (minsDate < 10) {
            minsDate = "0" + minsDate.toString();
          }
          let dateString = `${monthDate}-${dayDate}-${yearDate} ${hoursDate}:${minsDate} ${amOrPmDate}`;

          let formatOpen = new Date(tournament.open);
          let dayOpen = formatOpen.getDate();
          let monthOpen = formatOpen.getMonth() + 1;
          let yearOpen = formatOpen.getFullYear();
          let hoursOpen = formatOpen.getHours();
          let minsOpen = formatOpen.getMinutes();
          let amOrPmOpen;
          if (hoursOpen > 12) {
            hoursOpen = hoursOpen - 12;
            amOrPmOpen = "PM";
          } else if (hoursOpen < 12) {
            amOrPmOpen = "AM";
          } else if ((hoursOpen = 12)) {
            amOrPmOpen = "PM";
          }
          if (minsOpen < 10) {
            minsOpen = "0" + minsOpen.toString();
          }
          let openString = `${monthOpen}-${dayOpen}-${yearOpen} ${hoursOpen}:${minsOpen} ${amOrPmOpen}`;

          let formatDeadline = new Date(tournament.deadline);
          let dayDeadline = formatDeadline.getDate();
          let monthDeadline = formatDeadline.getMonth() + 1;
          let yearDeadline = formatDeadline.getFullYear();
          let hoursDeadline = formatDeadline.getHours();
          let minsDeadline = formatDeadline.getMinutes();
          let amOrPmDeadline;
          if (hoursDeadline > 12) {
            hoursDeadline = hoursDeadline - 12;
            amOrPmDeadline = "PM";
          } else if (hoursDeadline < 12) {
            amOrPmDeadline = "AM";
          } else if ((hoursDeadline = 12)) {
            amOrPmDeadline = "PM";
          }
          if (minsDeadline < 10) {
            minsDeadline = "0" + minsDeadline.toString();
          }
          let deadlineString = `${monthDeadline}-${dayDeadline}-${yearDeadline} ${hoursDeadline}:${minsDeadline} ${amOrPmDeadline}`;

          return {
            id: tournament.id,
            admin: tournament.admin,
            title: tournament.title,
            date: dateString,
            venue: tournament.venue,
            inOrOut: tournament.inOrOut,
            courts: tournament.courts,
            gender: tournament.gender,
            minAge: tournament.minAge,
            skill: tournament.skill,
            type: tournament.type,
            fee: tournament.fee,
            open: openString,
            deadline: deadlineString,
            organizer: tournament.organizer,
            contact: tournament.contact,
            details: tournament.details,
          };
        });

        dispatch(updateTournaments(newFetchedTourneys));
      }
    }
    if (value && value.docs[0] && user) {
      getTourneys();
    }
  }, [value, user]);

  return (
    <React.Fragment>
      <Header
        user={user}
        setUser={setUser}
        updateCreateToggle={updateCreateToggle}
      />
      <div className="tourneys">
        {createToggle || editable ? (
          <React.Fragment>
            <Blur />
            <CreateTourney
              user={user}
              db={db}
              updateCreateToggle={updateCreateToggle}
              setEditable={setEditable}
              editable={editable}
            />
          </React.Fragment>
        ) : null}
        <div className="tournaments">
          {tournaments.length && editable === null && createToggle === false
            ? tournaments.map((tournament, index) => (
                <div key={index} className="tournament">
                  <div className="details-title">{tournament.title}</div>
                  <div className="tournament-details">
                    <div className="detail">
                      <strong>Date & Time:</strong> {tournament.date}
                    </div>
                    <div className="detail">
                      <strong>Venue:</strong> {tournament.venue}
                    </div>
                    <div className="detail">
                      <strong>Indoor or Outdoor:</strong> {tournament.inOrOut}
                    </div>
                    <div className="detail">
                      <strong>Number of Courts:</strong> {tournament.courts}
                    </div>
                    <div className="detail">
                      <strong>Gender:</strong> {tournament.gender}
                    </div>
                    <div className="detail">
                      <strong>Minimum Age:</strong> {tournament.minAge} years
                    </div>
                    <div className="detail">
                      <strong>Skill Levels: </strong>
                      {tournament.skill
                        ? tournament.skill.toString()
                        : "1, 2, 3, 4, 5"}
                    </div>
                    <div className="detail">
                      <strong>Round-Robin Type:</strong> {tournament.type}
                    </div>
                    <div className="detail">
                      <strong>Registration Fee:</strong> ${tournament.fee}
                    </div>
                    <div className="detail">
                      <strong>Registration Start:</strong> {tournament.open}
                    </div>
                    <div className="detail">
                      <strong>Registration End:</strong> {tournament.deadline}
                    </div>
                    <div className="detail">
                      <strong>Organizer:</strong> {tournament.organizer}
                    </div>
                    <div className="detail">
                      <strong>Organizer Contact:</strong> {tournament.contact}
                    </div>
                  </div>
                  <div className="detail">
                    <strong>Details:</strong> {tournament.details}
                  </div>
                  <div className="option-buttons">
                    <button
                      className="option edit-button"
                      onClick={() => {
                        setEditable(tournament.id);
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      className="option"
                      onClick={() => {
                        deleteTourneys(tournament);
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Tourneys;
