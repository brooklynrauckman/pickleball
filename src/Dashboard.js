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
  const [court1, setCourt1] = useState([]);
  const [court2, setCourt2] = useState([]);
  const [court3, setCourt3] = useState([]);
  const [court4, setCourt4] = useState([]);
  const [court5, setCourt5] = useState([]);
  const [court6, setCourt6] = useState([]);
  const [court7, setCourt7] = useState([]);
  const [court8, setCourt8] = useState([]);

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

  const tourneyPlayers = players
    ? players.docs.map((doc) => doc.get("account"))
    : null;

  const playerNames = () => {
    let list = [];

    for (let i = 0; i < tourneyPlayers.length; i++) {
      list.push(tourneyPlayers[i].name);
    }
    return list;
  };

  const playerPairs = () => {
    let results = [];
    for (let i = 0; i < playerNames().length - 1; i++) {
      for (let j = i + 1; j < playerNames().length; j++) {
        results.push([playerNames()[i], playerNames()[j]]);
      }
    }
    return results;
  };

  // if (
  //   pairs[i][0] !== pairs[j][0] &&
  //   pairs[i][1] !== pairs[j][1] &&
  //   pairs[i][1] !== pairs[j][0] &&
  //   pairs[i][0] !== pairs[j][1]
  // )

  //Array is correct length but does not satisify the conditions above...
  const playerSets = () => {
    let results = [];
    let pairs = playerPairs();
    for (let i = 0; i < pairs.length; i + 2) {
      for (let j = i + 1; j < pairs.length; j + 2) {
        results.push([pairs[i], pairs[j]]);
        i = i + 2;
        j = j + 2;
      }
    }
    return results;
  };

  if (players) console.log(playerSets());

  const courtsCalc = () => {
    let courts;
    if (managedTourney.type === "Full") {
      if (tourneyPlayers.length === 4) courts = 1;
      if (tourneyPlayers.length === 8) courts = 2;
      if (tourneyPlayers.length === 12) courts = 3;
      if (tourneyPlayers.length === 16) courts = 4;
      if (managedTourney.type === "Modified") {
        if (tourneyPlayers.length <= 8 && tourneyPlayers.length >= 11)
          courts = 2;
        if (tourneyPlayers.length <= 12 && tourneyPlayers.length >= 15)
          courts = 3;
        if (tourneyPlayers.length <= 16 && tourneyPlayers.length >= 19)
          courts = 4;
        if (tourneyPlayers.length <= 20 && tourneyPlayers.length >= 23)
          courts = 5;
        if (tourneyPlayers.length <= 24 && tourneyPlayers.length >= 27)
          courts = 6;
        if (tourneyPlayers.length <= 28 && tourneyPlayers.length >= 31)
          courts = 7;
        if (tourneyPlayers.length <= 32 && tourneyPlayers.length >= 35)
          courts = 8;
      }
    }
    return courts;
  };

  const rounds =
    players && managedTourney.type === "Full" ? tourneyPlayers.length - 1 : 7;

  useEffect(() => {
    if (players) {
      setCourt1(playerNames().splice(0, 4));
      if (playerNames().length > 4 && playerNames().length <= 8)
        setCourt2(playerNames().splice(4, 8));
      if (playerNames().length > 8 && playerNames().length <= 12)
        setCourt3(playerNames().splice(8, 12));
      if (playerNames().length > 12 && playerNames().length <= 16)
        setCourt4(playerNames().splice(12, 16));
      if (playerNames().length > 16 && playerNames().length <= 20)
        setCourt5(playerNames().splice(16, 20));
      if (playerNames().length > 20 && playerNames().length <= 24)
        setCourt6(playerNames().splice(20, 24));
      if (playerNames().length > 24 && playerNames().length <= 28)
        setCourt7(playerNames().splice(24, 28));
      if (playerNames().length > 28 && playerNames().length <= 32)
        setCourt8(playerNames().splice(28, 32));
    }
  }, [players, activeRound]);

  return (
    <div className="dashboard-wrapper">
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
        {rounds > 3 ? (
          <button
            className={activeRound === 4 ? "round active" : "round"}
            onClick={() => setActiveRound(4)}
          >
            Round 4
          </button>
        ) : null}
        {rounds > 4 ? (
          <button
            className={activeRound === 5 ? "round active" : "round"}
            onClick={() => setActiveRound(5)}
          >
            Round 5
          </button>
        ) : null}
        {rounds > 5 ? (
          <button
            className={activeRound === 6 ? "round active" : "round"}
            onClick={() => setActiveRound(6)}
          >
            Round 6
          </button>
        ) : null}
        {rounds > 6 ? (
          <button
            className={activeRound === 7 ? "round active" : "round"}
            onClick={() => setActiveRound(7)}
          >
            Round 7
          </button>
        ) : null}
        {rounds > 7 ? (
          <button
            className={activeRound === 8 ? "round active" : "round"}
            onClick={() => setActiveRound(8)}
          >
            Round 8
          </button>
        ) : null}
        {rounds > 8 ? (
          <button
            className={activeRound === 9 ? "round active" : "round"}
            onClick={() => setActiveRound(9)}
          >
            Round 9
          </button>
        ) : null}
        {rounds > 9 ? (
          <button
            className={activeRound === 10 ? "round active" : "round"}
            onClick={() => setActiveRound(10)}
          >
            Round 10
          </button>
        ) : null}
        {rounds > 10 ? (
          <button
            className={activeRound === 11 ? "round active" : "round"}
            onClick={() => setActiveRound(11)}
          >
            Round 11
          </button>
        ) : null}
        {rounds > 11 ? (
          <button
            className={activeRound === 12 ? "round active" : "round"}
            onClick={() => setActiveRound(12)}
          >
            Round 12
          </button>
        ) : null}
        {rounds > 12 ? (
          <button
            className={activeRound === 13 ? "round active" : "round"}
            onClick={() => setActiveRound(13)}
          >
            Round 13
          </button>
        ) : null}
        {rounds > 13 ? (
          <button
            className={activeRound === 14 ? "round active" : "round"}
            onClick={() => setActiveRound(14)}
          >
            Round 14
          </button>
        ) : null}
        {rounds > 14 ? (
          <button
            className={activeRound === 15 ? "round active" : "round"}
            onClick={() => setActiveRound(15)}
          >
            Round 15
          </button>
        ) : null}
      </div>

      {players ? (
        <React.Fragment>
          <div>
            <div className="court-number">Court 1</div>
            <div className="court">
              <div className="court-half">
                <div className="team">
                  <div>{court1[0]}</div>
                  <div>{court1[1]}</div>
                </div>
                <input className="round-score" />
              </div>
              <div className="net"></div>
              <div className="court-half">
                <div className="team">
                  <div>{court1[2]}</div>
                  <div>{court1[3]}</div>
                </div>
                <input className="round-score" />
              </div>
            </div>
          </div>
          {courtsCalc() > 1 ? (
            <div>
              <div className="court-number">Court 2</div>
              <div className="court">
                <div className="court-half">
                  <div className="team">
                    <div>{court2[0]}</div>
                    <div>{court2[1]}</div>
                  </div>
                  <input className="round-score" />
                </div>
                <div className="net"></div>
                <div className="court-half">
                  <div className="team">
                    <div>{court2[2]}</div>
                    <div>{court2[3]}</div>
                  </div>
                  <input className="round-score" />
                </div>
              </div>
            </div>
          ) : null}
          {courtsCalc() > 2 ? (
            <div>
              <div className="court-number">Court 3</div>
              <div className="court">
                <div className="court-half">
                  <div className="team">
                    <div>{court3[0]}</div>
                    <div>{court3[1]}</div>
                  </div>
                  <input className="round-score" />
                </div>
                <div className="net"></div>
                <div className="court-half">
                  <div className="team">
                    <div>{court3[2]}</div>
                    <div>{court3[3]}</div>
                  </div>
                  <input className="round-score" />
                </div>
              </div>
            </div>
          ) : null}
          {courtsCalc() > 3 ? (
            <div>
              <div className="court-number">Court 4</div>
              <div className="court">
                <div className="court-half">
                  <div className="team">
                    <div>{court4[0]}</div>
                    <div>{court4[1]}</div>
                  </div>
                  <input className="round-score" />
                </div>
                <div className="net"></div>
                <div className="court-half">
                  <div className="team">
                    <div>{court4[2]}</div>
                    <div>{court4[3]}</div>
                  </div>
                  <input className="round-score" />
                </div>
              </div>
            </div>
          ) : null}
          {courtsCalc() > 4 ? (
            <div>
              <div className="court-number">Court 5</div>
              <div className="court">
                <div className="court-half">
                  <div className="team">
                    <div>{court5[0]}</div>
                    <div>{court5[1]}</div>
                  </div>
                  <input className="round-score" />
                </div>
                <div className="net"></div>
                <div className="court-half">
                  <div className="team">
                    <div>{court5[2]}</div>
                    <div>{court5[3]}</div>
                  </div>
                  <input className="round-score" />
                </div>
              </div>
            </div>
          ) : null}
          {courtsCalc() > 5 ? (
            <div>
              <div className="court-number">Court 6</div>
              <div className="court">
                <div className="court-half">
                  <div className="team">
                    <div>{court6[0]}</div>
                    <div>{court6[1]}</div>
                  </div>
                  <input className="round-score" />
                </div>
                <div className="net"></div>
                <div className="court-half">
                  <div className="team">
                    <div>{court6[2]}</div>
                    <div>{court6[3]}</div>
                  </div>
                  <input className="round-score" />
                </div>
              </div>
            </div>
          ) : null}
          {courtsCalc() > 6 ? (
            <div>
              <div className="court-number">Court 7</div>
              <div className="court">
                <div className="court-half">
                  <div className="team">
                    <div>{court7[0]}</div>
                    <div>{court7[1]}</div>
                  </div>
                  <input className="round-score" />
                </div>
                <div className="net"></div>
                <div className="court-half">
                  <div className="team">
                    <div>{court7[2]}</div>
                    <div>{court7[3]}</div>
                  </div>
                  <input className="round-score" />
                </div>
              </div>
            </div>
          ) : null}
          {courtsCalc() > 7 ? (
            <div>
              <div className="court-number">Court 8</div>
              <div className="court">
                <div className="court-half">
                  <div className="team">
                    <div>{court8[0]}</div>
                    <div>{court8[1]}</div>
                  </div>
                  <input className="round-score" />
                </div>
                <div className="net"></div>
                <div className="court-half">
                  <div className="team">
                    <div>{court8[2]}</div>
                    <div>{court8[3]}</div>
                  </div>
                  <input className="round-score" />
                </div>
              </div>
            </div>
          ) : null}
        </React.Fragment>
      ) : (
        "loading"
      )}
    </div>
  );
};

export default Dashboard;
