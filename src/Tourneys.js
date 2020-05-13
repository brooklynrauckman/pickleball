import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

const Tourneys = (props) => {
  const {
    user,
    title,
    date,
    location,
    courts,
    deadline,
    isOpen,
    setIsOpen,
  } = props;

  const [value] = useCollection(
    firebase
      .firestore()
      .collection("users")
      .where("userId", "==", user ? user.uid : "")
  );

  const [tournaments, updateTournaments] = useState([]);

  async function deleteTourneys(tournament) {
    const querySnapshot = await value.docs[0].get("tournaments");
    const updatedArray = querySnapshot.filter((t) => {
      if (t.title !== tournament.title) {
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
      // CHANGE FETCHED BADGES
      const newFetchedTourneys = fetchedTourneys.map((tournament) => {
        return {
          title: tournament.title,
          deadline: tournament.deadline,
          date: tournament.date,
          location: tournament.location,
          courts: tournament.courts,
        };
      });
      updateTournaments(newFetchedTourneys);
    }
    if (value && value.docs[0] && user) {
      getTourneys();
    }
  }, [value]);
  return (
    <div className="tournaments">
      {tournaments.length
        ? tournaments.map((tournament, index) => (
            <div key={index} className="tournament">
              {isOpen === index ? (
                <div className="options-list">
                  <svg
                    className="options"
                    onClick={() => setIsOpen(null)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                  <div
                    className="option"
                    onClick={() => {
                      setIsOpen(null);
                      deleteTourneys(tournament);
                    }}
                  >
                    Remove
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <svg
                    className="options"
                    id={tournament.id}
                    onClick={() => setIsOpen(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                  <div className="tournament-details">
                    <div>{tournament.title}</div>
                    <div>{tournament.date}</div>
                    <div>{tournament.location}</div>
                  </div>
                </React.Fragment>
              )}
            </div>
          ))
        : ""}
    </div>
  );
};

export default Tourneys;
