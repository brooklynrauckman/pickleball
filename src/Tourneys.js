import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector, useDispatch } from "react-redux";
import {
  updateTournaments,
  updateTournament,
  updateAccount,
  updateIds,
} from "./redux/actions/actions";
import CreateTourney from "./CreateTourney.js";
import SetUp from "./SetUp.js";
import Sidebar from "./Sidebar.js";
import Header from "./Header.js";
import Blur from "./Blur.js";

const Tourneys = (props) => {
  const { user, setUser, db } = props;
  const [editable, setEditable] = useState(null);
  const [createToggle, updateCreateToggle] = useState(false);
  const [setUpToggle, updateSetUpToggle] = useState(false);
  const [setUp, updateSetUp] = useState(false);
  const [register, setRegister] = useState(false);
  const [readyForDb, setReadyForDb] = useState(false);

  const dispatch = useDispatch();

  const { tournaments, tournament, account } = useSelector((state) => ({
    tournaments: state.pickleball.tournaments,
    tournament: state.pickleball.tournament,
    account: state.pickleball.account,
    ids: state.pickleball.ids,
  }));

  let participants = tournament.participants;
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const convertDate = (t) => {
    let dateTimestamp = new Date(t.date);
    let dateDay = dateTimestamp.getDay();
    let dateMonth = dateTimestamp.getMonth();
    let dateDate = dateTimestamp.getDate();
    let dateYear = dateTimestamp.getFullYear();
    let dateDayOfWeek = daysOfWeek[dateDay];
    let dateMonthOfYear = monthsOfYear[dateMonth];
    return ` ${dateDayOfWeek}, ${dateMonthOfYear} ${dateDate}, ${dateYear}`;
  };
  const convertDeadline = (t) => {
    let dateTimestamp = new Date(t.deadline);
    let dateDay = dateTimestamp.getDay();
    let dateMonth = dateTimestamp.getMonth();
    let dateDate = dateTimestamp.getDate();
    let dateYear = dateTimestamp.getFullYear();
    let dateDayOfWeek = daysOfWeek[dateDay];
    let dateMonthOfYear = monthsOfYear[dateMonth];
    return ` ${dateDayOfWeek}, ${dateMonthOfYear} ${dateDate}, ${dateYear}`;
  };
  const convertOpen = (t) => {
    let dateTimestamp = new Date(t.open);
    let dateDay = dateTimestamp.getDay();
    let dateMonth = dateTimestamp.getMonth();
    let dateDate = dateTimestamp.getDate();
    let dateYear = dateTimestamp.getFullYear();
    let dateDayOfWeek = daysOfWeek[dateDay];
    let dateMonthOfYear = monthsOfYear[dateMonth];
    return ` ${dateDayOfWeek}, ${dateMonthOfYear} ${dateDate}, ${dateYear}`;
  };

  const convertTime = (t) => {
    let timeHours = parseInt(t.time.substring(0, 2));
    let timeMinutes = parseInt(t.time.substring(3, 5));
    let convertMinutes = timeMinutes < 10 ? `0${timeMinutes}` : timeMinutes;
    if (timeHours > 12) return `${timeHours - 12}:${convertMinutes} PM`;
    if ((timeHours = 12)) return `${timeHours}:${convertMinutes} PM`;
    if (timeHours < 12) return `${timeHours}:${convertMinutes} AM`;
  };

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

  const [all] = useCollection(firebase.firestore().collection("tournaments"));

  async function deleteTourneys(t) {
    const querySnapshot = await all.docs[0].get("tournaments");

    const updatedArray = querySnapshot.filter((tmt) => {
      if (tmt.id !== t.id) {
        return tmt;
      }
    });
    const c = window.confirm(
      "Press OK to confirm you want to delete this tournament."
    );

    if (c === true) {
      all.docs[0].ref.update({
        tournaments: updatedArray,
      });
    } else {
      console.log("Delete Canceled");
    }
  }

  const deleteParticipant = async (t) => {
    const myTourney = tournaments.filter((tmt) => tmt.id === t.id);
    let temp;
    if (myTourney.length) {
      const registeredIds = myTourney[0].participants.filter(
        (p) => p !== user.uid
      );
      temp = {
        ...t,
        ...{
          participants: registeredIds,
        },
      };

      dispatch(updateTournament(temp));
    }

    const c = window.confirm(
      "Press OK to confirm you want to unregister from this tournament."
    );
    if (c === true) {
      dispatch(
        updateTournaments(
          tournaments.map((tmt) => {
            if (tmt.id === temp.id) {
              return temp;
            } else return tmt;
          })
        )
      );
      setReadyForDb(true);
    } else {
      console.log("Action Canceled");
    }
  };

  useEffect(() => {
    if (readyForDb) {
      all.docs[0].ref.update({
        tournaments: tournaments,
      });
      setReadyForDb(false);
    }
  }, [readyForDb]);

  // WATCHER, when redux updates participants, if there is a tournament ID go update the master list
  useEffect(() => {
    async function addParticipants() {
      try {
        const querySnapshot = await all.docs[0].get("tournaments");

        for (let i in tournaments) {
          if (tournament.id === tournaments[i].id) {
            tournaments[i].participants = tournament.participants;

            all.docs[0].ref.update({
              tournaments: tournaments,
            });
          }
        }
        window.alert("Registration successful!");
        setRegister(false);
      } catch (error) {
        window.alert("Registration Error");
        console.log("Registration Error", error);
      }
    }
    if (register && tournament.id && all && all.docs[0]) {
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
  }, [tournament.participants, all, register]);

  useEffect(() => {
    async function getTourneys() {
      // we assume there is only 1 result so hardcode the [0]
      const fetchedTourneys = await all.docs[0].get("tournaments");
      if (fetchedTourneys.length) {
        const newFetchedTourneys = fetchedTourneys.map((t) => {
          return {
            id: t.id,
            admin: t.admin,
            title: t.title,
            date: t.date,
            time: t.time,
            venue: t.venue,
            address: t.address,
            city: t.city,
            state: t.state,
            zipcode: t.zipcode,
            inOrOut: t.inOrOut,
            courts: t.courts,
            gender: t.gender,
            minAge: t.minAge,
            skill: t.skill,
            type: t.type,
            fee: t.fee,
            open: t.open,
            deadline: t.deadline,
            organizer: t.organizer,
            contact: t.contact,
            phone: t.phone,
            details: t.details,
            participants: t.participants,
            maxPlayers: t.maxPlayers,
          };
        });

        dispatch(updateTournaments(newFetchedTourneys));
      }
    }
    async function getAccount() {
      // we assume there is only 1 result so hardcode the [0]
      const fetchedAccount = await value.docs[0].get("account");
      if (fetchedAccount) {
        dispatch(
          updateAccount({
            name: fetchedAccount.name,
            email: fetchedAccount.email,
            phone: fetchedAccount.phone,
            birthdate: fetchedAccount.birthdate,
            gender: fetchedAccount.gender,
            skill: fetchedAccount.skill,
          })
        );
        if (fetchedAccount.name === "" || fetchedAccount.name === undefined) {
          updateSetUp(false);
        } else {
          updateSetUp(true);
        }
      }
    }
    async function getIds() {
      // we assume there is only 1 result so hardcode the [0]

      const fetchedIds = await value.docs[0].get("id");
      if (fetchedIds) {
        dispatch(updateIds(fetchedIds));
      }
    }
    if (value && value.docs[0] && all && all.docs[0] && user) {
      getTourneys();
      getAccount();
      getIds();
    }
  }, [value, all, user]);

  return (
    <React.Fragment>
      <Header
        user={user}
        setUser={setUser}
        updateCreateToggle={updateCreateToggle}
        updateSetUpToggle={updateSetUpToggle}
        setUp={setUp}
      />
      <Sidebar />
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
                      <strong>Date & Time:</strong>
                      {`${convertDate(t)} ${convertTime(t)}`}
                    </div>
                    <div className="detail">
                      <strong>Venue:</strong> {t.venue}
                    </div>
                    <div className="detail">
                      <strong>Location:</strong>{" "}
                      {`${t.address}, ${t.city}, ${t.state} ${t.zipcode}`}
                    </div>
                    <div className="detail">
                      <strong>Number of Courts:</strong> {t.courts} {t.inOrOut}
                    </div>
                    <div className="detail">
                      <strong>Gender:</strong> {t.gender}
                    </div>
                    {t.minAge !== 0 ? (
                      <div className="detail">
                        <strong>Minimum Age:</strong> {t.minAge} years
                      </div>
                    ) : null}
                    <div className="detail">
                      <strong>Skill Levels: </strong>
                      {t.skill && t.skill.toString() !== "0,6"
                        ? `${t.skill[0]}-${t.skill[1]}`
                        : "All"}
                    </div>
                    <div className="detail">
                      <strong>Round-Robin Type:</strong> {t.type}
                    </div>
                    {t.fee ? (
                      <div className="detail">
                        <strong>Registration Fee:</strong> ${t.fee}
                      </div>
                    ) : null}
                    <div className="detail">
                      <strong>Registration Start:</strong> {convertOpen(t)}
                    </div>
                    <div className="detail">
                      <strong>Registration End:</strong> {convertDeadline(t)}
                    </div>

                    <div className="detail">
                      <strong>Organizer:</strong> {t.organizer}
                    </div>
                    {t.email ? (
                      <div className="detail">
                        <strong>Organizer Email:</strong> {t.contact}
                      </div>
                    ) : null}
                    {t.phone ? (
                      <div className="detail">
                        <strong>Organizer Phone:</strong> {t.phone}
                      </div>
                    ) : null}

                    <div className="detail">
                      <strong>Participants:</strong>{" "}
                      {`${t.participants.length} out of ${t.maxPlayers}`}{" "}
                    </div>
                  </div>
                  {t.details ? (
                    <div className="detail">
                      <strong>Details:</strong> {t.details}
                    </div>
                  ) : null}
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
                      <React.Fragment>
                        {!t.participants.filter((p) => p === user.uid)
                          .length ? (
                          <button
                            className="option"
                            onClick={() => {
                              if (
                                (t.gender === "Womens" &&
                                  account.gender === "Male") ||
                                (t.gender === "Mens" &&
                                  account.gender === "Female")
                              )
                                window.alert(
                                  "Sorry, you do not qualify for this tournament based on your gender."
                                );
                              else if (
                                account.skill <= t.skill[0] ||
                                account.skill >= t.skill[1]
                              )
                                window.alert(
                                  "Sorry, you do not qualify for this tournament based on your skill level."
                                );
                              else if (
                                t.minAge >
                                t.date.substring(0, 3) -
                                  account.birthdate.substring(0, 3)
                              )
                                window.alert(
                                  "Sorry, you do not qualify for this tournament based on your age."
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
                                setRegister(true);
                              }
                            }}
                          >
                            REGISTER
                          </button>
                        ) : (
                          <button
                            className="option"
                            onClick={() => {
                              deleteParticipant(t);
                            }}
                          >
                            UNREGISTER
                          </button>
                        )}
                      </React.Fragment>
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
