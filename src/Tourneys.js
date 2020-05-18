import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector, useDispatch } from "react-redux";
import {
  updateTournaments,
  updateTournament,
  updateAccount,
} from "./redux/actions/actions";
import CreateTourney from "./CreateTourney.js";
import SetUp from "./SetUp.js";

import Header from "./Header.js";
import Blur from "./Blur.js";

const Tourneys = (props) => {
  const { user, setUser, db } = props;
  const [editable, setEditable] = useState(null);
  const [createToggle, updateCreateToggle] = useState(false);
  const [setUpToggle, updateSetUpToggle] = useState(false);
  const [setUp, updateSetUp] = useState(false);

  const dispatch = useDispatch();

  const { tournaments, tournament, account } = useSelector((state) => ({
    tournaments: state.pickleball.tournaments,
    tournament: state.pickleball.tournament,
    account: state.pickleball.account,
  }));

  let participants = tournament.participants;

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
        const newFetchedTourneys = fetchedTourneys.map((t) => {
          let formatDate = new Date(t.date);
          let dayDate = formatDate.getDate();
          let monthDate = formatDate.getMonth() + 1;
          let yearDate = formatDate.getFullYear();
          let hoursDate = formatDate.getHours();
          let minsDate = formatDate.getMinutes();
          let amOrPmDate;
          if (hoursDate > 12 && hoursDate < 24) {
            hoursDate = hoursDate - 12;
            amOrPmDate = "PM";
          } else if (hoursDate < 12 && hoursDate > 0) {
            amOrPmDate = "AM";
          } else if (hoursDate === 12) {
            amOrPmDate = "PM";
          } else if (hoursDate === 24) {
            hoursDate = hoursDate - 12;
            amOrPmDate = "AM";
          } else if (hoursDate === 0) {
            hoursDate = hoursDate + 12;
            amOrPmDate = "AM";
          }
          if (minsDate < 10) {
            minsDate = "0" + minsDate.toString();
          }
          let dateString = `${monthDate}-${dayDate}-${yearDate} ${hoursDate}:${minsDate} ${amOrPmDate}`;

          let formatOpen = new Date(t.open);
          let dayOpen = formatOpen.getDate();
          let monthOpen = formatOpen.getMonth() + 1;
          let yearOpen = formatOpen.getFullYear();
          let hoursOpen = formatOpen.getHours();
          let minsOpen = formatOpen.getMinutes();
          let amOrPmOpen;
          if (hoursOpen > 12 && hoursOpen < 24) {
            hoursOpen = hoursOpen - 12;
            amOrPmOpen = "PM";
          } else if (hoursOpen < 12 && hoursOpen > 0) {
            amOrPmOpen = "AM";
          } else if (hoursOpen === 12) {
            amOrPmOpen = "PM";
          } else if (hoursOpen === 24) {
            hoursOpen = hoursOpen - 12;
            amOrPmOpen = "AM";
          } else if (hoursOpen === 0) {
            hoursOpen = hoursOpen + 12;
            amOrPmOpen = "AM";
          }
          if (minsOpen < 10) {
            minsOpen = "0" + minsOpen.toString();
          }
          let openString = `${monthOpen}-${dayOpen}-${yearOpen} ${hoursOpen}:${minsOpen} ${amOrPmOpen}`;

          let formatDeadline = new Date(t.deadline);
          let dayDeadline = formatDeadline.getDate();
          let monthDeadline = formatDeadline.getMonth() + 1;
          let yearDeadline = formatDeadline.getFullYear();
          let hoursDeadline = formatDeadline.getHours();
          let minsDeadline = formatDeadline.getMinutes();
          let amOrPmDeadline;
          if (hoursDeadline > 12 && hoursDeadline < 24) {
            hoursDeadline = hoursDeadline - 12;
            amOrPmDeadline = "PM";
          } else if (hoursDeadline < 12 && hoursDeadline > 0) {
            amOrPmDeadline = "AM";
          } else if (hoursDeadline === 12) {
            amOrPmDeadline = "PM";
          } else if (hoursDeadline === 24) {
            hoursDeadline = hoursDeadline - 12;
            amOrPmDeadline = "AM";
          } else if (hoursDeadline === 0) {
            hoursDeadline = hoursDeadline + 12;
            amOrPmDeadline = "AM";
          }
          if (minsDeadline < 10) {
            minsDeadline = "0" + minsDeadline.toString();
          }
          let deadlineString = `${monthDeadline}-${dayDeadline}-${yearDeadline} ${hoursDeadline}:${minsDeadline} ${amOrPmDeadline}`;

          return {
            id: t.id,
            admin: t.admin,
            title: t.title,
            date: dateString,
            venue: t.venue,
            inOrOut: t.inOrOut,
            courts: t.courts,
            gender: t.gender,
            minAge: t.minAge,
            skill: t.skill,
            type: t.type,
            fee: t.fee,
            open: openString,
            deadline: deadlineString,
            organizer: t.organizer,
            contact: t.contact,
            details: t.details,
            participants: t.participants,
          };
        });

        dispatch(updateTournaments(newFetchedTourneys));
      }
    }
    async function getAccount() {
      // we assume there is only 1 result so hardcode the [0]
      const fetchedAccount = await value.docs[0].get("account");
      if (fetchedAccount) {
        let birthdateObj = new Date(fetchedAccount.birthdate);
        let birthdateYear = birthdateObj.getFullYear();
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let age = currentYear - birthdateYear;
        dispatch(
          updateAccount({
            name: fetchedAccount.name,
            email: fetchedAccount.email,
            phone: fetchedAccount.phone,
            birthdate: age,
            gender: fetchedAccount.gender,
            skill: fetchedAccount.skill,
          })
        );
        if (fetchedAccount.name !== "") {
          updateSetUp(true);
        } else {
          console.log("new");
        }
      }
    }
    if (value && value.docs[0] && user) {
      getTourneys();
      getAccount();
    }
  }, [value, user]);

  // WATCHER, when redux updates participants, if there is a tournament ID go update the master list
  useEffect(() => {
    async function addParticipants() {
      try {
        const querySnapshot = await db
          .collection("users")
          .where("userId", "==", user.uid)
          .get();
        for (let i in tournaments) {
          if (tournament.id === tournaments[i].id) {
            tournaments[i].participants = tournament.participants;

            querySnapshot.docs[0].ref.update({
              tournaments: tournaments,
            });
          }
        }
        window.alert("Registration successful!");
        console.log("Registration successful", tournament.participants);
      } catch (error) {
        window.alert("Registration Error");
        console.log("Registration Error", error);
      }
    }
    if (tournament.id) {
      tournaments.map((tmt) => {
        if (
          tmt.id === tournament.id &&
          !tmt.participants.filter((participant) => participant === user.uid)
            .length
        ) {
          dispatch(
            updateTournaments(
              tournaments.map((tmt) => {
                if (tmt.id === tournament.id) return tournament;
                else return tmt;
              })
            )
          );
          addParticipants();
        }
      });
    }
  }, [tournament.participants]);

  return (
    <React.Fragment>
      <Header
        user={user}
        setUser={setUser}
        updateCreateToggle={updateCreateToggle}
        updateSetUpToggle={updateSetUpToggle}
        setUp={setUp}
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
        {setUpToggle ? (
          <React.Fragment>
            <Blur />
            <SetUp
              db={db}
              user={user}
              updateSetUpToggle={updateSetUpToggle}
              setUp={setUp}
            />
          </React.Fragment>
        ) : null}
        <div className="tournaments">
          {tournaments.length && editable === null && createToggle === false
            ? tournaments.map((t, index) => (
                <div key={index} className="tournament">
                  <div className="details-title">{t.title}</div>
                  <div className="tournament-details">
                    <div className="detail">
                      <strong>Date & Time:</strong> {t.date}
                    </div>
                    <div className="detail">
                      <strong>Venue:</strong> {t.venue}
                    </div>
                    <div className="detail">
                      <strong>Indoor or Outdoor:</strong> {t.inOrOut}
                    </div>
                    <div className="detail">
                      <strong>Number of Courts:</strong> {t.courts}
                    </div>
                    <div className="detail">
                      <strong>Gender:</strong> {t.gender}
                    </div>
                    <div className="detail">
                      <strong>Minimum Age:</strong> {t.minAge} years
                    </div>
                    <div className="detail">
                      <strong>Skill Level(s): </strong>
                      {t.skill ? t.skill.toString() : "1, 2, 3, 4, 5"}
                    </div>
                    <div className="detail">
                      <strong>Round-Robin Type:</strong> {t.type}
                    </div>
                    <div className="detail">
                      <strong>Registration Fee:</strong> ${t.fee}
                    </div>
                    <div className="detail">
                      <strong>Registration Start:</strong> {t.open}
                    </div>
                    <div className="detail">
                      <strong>Registration End:</strong> {t.deadline}
                    </div>
                    <div className="detail">
                      <strong>Organizer:</strong> {t.organizer}
                    </div>
                    <div className="detail">
                      <strong>Organizer Contact:</strong> {t.contact}
                    </div>
                  </div>
                  <div className="detail">
                    <strong>Details:</strong> {t.details}
                  </div>
                  <div className="detail">
                    <strong>Participants:</strong> {t.participants.length}
                  </div>
                  <div className="option-buttons">
                    {user.displayName === "Brooklyn Rauckman" ? (
                      <React.Fragment>
                        <button
                          className="option edit-button"
                          onClick={() => {
                            setEditable(t.id);
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          className="option"
                          onClick={() => {
                            deleteTourneys(t);
                          }}
                        >
                          DELETE
                        </button>
                      </React.Fragment>
                    ) : (
                      <button
                        className="option"
                        onClick={() => {
                          if (
                            (t.gender === "Womens" &&
                              account.gender === "Male") ||
                            (t.gender === "Mens" && account.gender === "Female")
                          )
                            window.alert(
                              "Sorry, you do not qualify for this tournament."
                            );
                          else if (
                            !t.skill.filter((s) => s === account.skill).length
                          )
                            window.alert(
                              "Sorry, you do not qualify for this tournament."
                            );
                          else if (t.minAge > account.birthdate)
                            window.alert(
                              "Sorry, you do not qualify for this tournament."
                            );
                          else {
                            dispatch(
                              // copy the full tourney plus add a deep key of participants
                              updateTournament({
                                ...t,
                                ...{
                                  participants: [
                                    ...t.participants,
                                    ...[user.uid],
                                  ],
                                },
                              })
                            );
                          }
                        }}
                      >
                        REGISTER
                      </button>
                    )}
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
