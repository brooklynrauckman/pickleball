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

const Dashboard = (props) => {
  const { openTourney } = props;
  const [activeRound, setActiveRound] = useState(1);

  const dispatch = useDispatch();

  const { tournaments, tournament } = useSelector((state) => ({
    tournaments: state.pickleball.tournaments,
    tournament: state.pickleball.tournament,
  }));

  const managedTourney = tournaments.filter((t) => t.id === openTourney)[0];

  const tourneyPlayerIds = managedTourney.participants;

  const [players] = useCollection(
    firebase
      .firestore()
      .collection("users")
      .where("userId", "in", tourneyPlayerIds)
  );

  const tourneyPlayerAccounts = players
    ? players.docs.map((doc) => doc.get("account"))
    : null;

  return (
    <div>
      <div className="dashboard-title">{managedTourney.title}</div>
      <div className="rounds">
        <button
          className={activeRound === 1 ? "round active" : "round"}
          onClick={() => setActiveRound(1)}
        >
          Round 1
        </button>
        <button
          className={activeRound === 2 ? "round active" : "round"}
          onClick={() => setActiveRound(2)}
        >
          Round 2
        </button>
        <button
          className={activeRound === 3 ? "round active" : "round"}
          onClick={() => setActiveRound(3)}
        >
          Round 3
        </button>
      </div>
      <div>
        {players
          ? tourneyPlayerAccounts.map((p) => <div>{p.name}</div>)
          : "loading"}
      </div>
    </div>
  );
};

export default Dashboard;
