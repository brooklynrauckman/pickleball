import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import CreateTourney from "./CreateTourney.js";
import Header from "./Header.js";
import Blur from "./Blur.js";

const Tourneys = (props) => {
  const { user, setUser, db } = props;
  const [tournaments, updateTournaments] = useState([]);
  const [editable, setEditable] = useState(false);
  const [createToggle, updateCreateToggle] = useState(false);

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

  // async function editTourney(
  //   title,
  //   venue,
  //   courts,
  //   gender,
  //   fee,
  //   contact,
  //   organizer,
  //   details
  // ) {
  //   try {
  //     const querySnapshot = await db
  //       .collection("users")
  //       .where("userId", "==", user.uid)
  //       .get();
  //     const tempList = querySnapshot.docs[0].get("tournaments");
  //     for (let t in tempList) {
  //       if (isOpen === tempList[t].id) {
  //         tempList[t].title = title;
  //         tempList[t].venue = venue;
  //         tempList[t].courts = courts;
  //         tempList[t].genfer = gender;
  //         tempList[t].fee = fee;
  //         tempList[t].contact = contact;
  //         tempList[t].organizer = organizer;
  //         tempList[t].details = details;
  //         querySnapshot.docs[0].ref.update({
  //           tournaments: tempList,
  //         });
  //         window.alert("Tournament update successful!");
  //         history.push("/tourneys");
  //       }
  //     }
  //   } catch (error) {
  //     window.alert("Error updating tournament.");
  //     console.log("Error updating tournament", error);
  //   }
  // }

  async function deleteTourneys(tournament) {
    const querySnapshot = await value.docs[0].get("tournaments");
    const updatedArray = querySnapshot.filter((t) => {
      if (t.id !== tournament.id) {
        console.log(t);
        return t;
      }
    });
    value.docs[0].ref.update({
      tournaments: updatedArray,
    });
  }

  useEffect(() => {
    async function getTourneys() {
      // we assume there is only 1 result so hardcode the [0]
      const fetchedTourneys = await value.docs[0].get("tournaments");

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
        let dateString = `${monthDate}-${dayDate}-${yearDate} ${hoursDate}:${minsDate} ${amOrPmDate}`;

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
        let deadlineString = `${monthDeadline}-${dayDeadline}-${yearDeadline} ${hoursDeadline}:${minsDeadline} ${amOrPmDeadline}`;

        return {
          id: tournament.id,
          admin: tournament.admin,
          title: tournament.title,
          date: dateString,
          venue: tournament.venue,
          courts: tournament.courts,
          gender: tournament.gender,
          fee: tournament.fee,
          deadline: deadlineString,
          organizer: tournament.organizer,
          contact: tournament.contact,
          details: tournament.details,
        };
      });
      updateTournaments(newFetchedTourneys);
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
        {createToggle ? (
          <React.Fragment>
            <Blur />
            <CreateTourney
              user={user}
              db={db}
              updateCreateToggle={updateCreateToggle}
            />
          </React.Fragment>
        ) : null}
        <div className="tournaments">
          {tournaments.length
            ? tournaments.map((tournament) => (
                <div key={tournament.id} className="tournament">
                  <div className="details-title">{tournament.title}</div>
                  <div className="tournament-details">
                    <div className="detail">
                      <strong>Date & Time:</strong> {tournament.date}
                    </div>
                    <div className="detail">
                      <strong>Venue:</strong> {tournament.venue}
                    </div>
                    <div className="detail">
                      <strong>Number of Courts:</strong> {tournament.courts}
                    </div>
                    <div className="detail">
                      <strong>Gender:</strong> {tournament.gender}
                    </div>
                    <div className="detail">
                      <strong>Registration Fee:</strong> $ {tournament.fee}
                    </div>
                    <div className="detail">
                      <strong>Registration Deadline:</strong>{" "}
                      {tournament.deadline}
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
                        setEditable(true);
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
