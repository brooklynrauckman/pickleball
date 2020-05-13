import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";

const Tourneys = (props) => {
  const {
    user,
    title,
    date,
    venue,
    courts,
    gender,
    fee,
    deadline,
    contact,
    organizer,
    details,
    isOpen,
    setIsOpen,
    tournaments,
    updateTournaments,
  } = props;

  const [value] = useCollection(
    firebase
      .firestore()
      .collection("users")
      .where("userId", "==", user ? user.uid : "")
  );

  async function deleteTourneys(tournament) {
    const querySnapshot = await value.docs[0].get("tournaments");
    const updatedArray = querySnapshot.filter((t) => {
      if (t.title !== tournament.title) {
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
                    width="25"
                    height="25"
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
                  <Link to="/edit" className="link-edit">
                    <div
                      className="option"
                      onClick={() => {
                        setIsOpen(index);
                      }}
                    >
                      Edit
                    </div>
                  </Link>
                  <div
                    className="option"
                    onClick={() => {
                      setIsOpen(null);
                      deleteTourneys(tournament);
                    }}
                  >
                    Delete
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <svg
                    className="options"
                    id={tournament.id}
                    onClick={() => setIsOpen(index)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
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
                      <strong>Registration Fee:</strong> {tournament.fee}
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
                </React.Fragment>
              )}
            </div>
          ))
        : ""}
    </div>
  );
};

export default Tourneys;
