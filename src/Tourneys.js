import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

const Tourneys = (props) => {
  const { user, title, date, location, time, courts, deadline } = props;

  const [value] = useCollection(
    firebase
      .firestore()
      .collection("users")
      .where("userId", "==", user ? user.uid : "")
  );

  const [tournaments, updateTournaments] = useState([]);

  const toggleOptions = (options) => {
    const updatedTournaments = tournaments.map((tournament) => {
      if (tournament.title === options.title) {
        console.log("selected");
      }
      return tournament;
    });
    updateTournaments(updatedTournaments);
  };

  // async function updateTourneys(tournament) {
  //   const querySnapshot = await value.docs[0].get("tournaments");
  //   const updatedArray = querySnapshot.map((t) => {
  //     if (t.title === tournament.title) {
  //       // remove unneeded key from UI
  //       delete t.selected;
  //       t.completed = !tournament.completed;
  //     }
  //     return t;
  //   });
  //   // after the loop update the loop in its entiretiy
  //   value.docs[0].ref.update({
  //     tournaments: updatedArray,
  //   });
  // }

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
        };
      });
      updateTournaments(newFetchedTourneys);
    }
    if (value && value.docs[0] && user) {
      getTourneys();
    }
  }, [value]);

  return (
    <div className="badges-wrapper">
      <div className="badges">
        {tournaments.length
          ? tournaments.map((tournaments, index) => (
              <div
                key={tournaments.title.toString()}
                className={tournaments.completed ? "badge completed" : "badge"}
              >
                {tournaments.selected ? (
                  <div className="options-list">
                    <svg
                      className="options"
                      onClick={() => toggleOptions(tournaments)}
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
                        toggleOptions(tournaments);
                        // updateTourneys(tournaments);
                      }}
                    ></div>
                    <div
                      className="option"
                      onClick={() => {
                        toggleOptions(tournaments);
                        deleteTourneys(tournaments);
                      }}
                    >
                      Remove
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <svg
                      className="options"
                      id={`tournaments-${index}`}
                      onClick={() => toggleOptions(tournaments)}
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
                    <div className="challenge">{tournaments.title}</div>
                  </React.Fragment>
                )}
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default Tourneys;
