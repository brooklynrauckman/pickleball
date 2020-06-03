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
    if (activeRound === 2) {
      let evens = [];
      let odds = [];
      for (let i = 0; i < list.length; i++) {
        if (i % 2 === 0) evens.push(list[i]);
        if (i % 2 !== 0) odds.push(list[i]);
      }
      list = evens.concat(odds);
    }
    if (activeRound === 3) {
      let set = [];
      for (let i = 0; i < list.length; i++) {
        let first;
        let inner;
        let outer;
        let last;
        if (i % 4 === 0) {
          first = list[i];
          inner = list[i + 1];
          outer = list[i + 2];
          last = list[i + 3];
          set.push(first, last, inner, outer);
        }
      }
      list = set;
    }
    if (activeRound > 3) {
      let set = [];
      for (let i = 0; i < list.length; i++) {
        let one = list[i];
        let two = list[i + 1];
        let three = list[i + 2];
        let four = list[i + 3];
        let five = list[i + 4];
        let six = list[i + 5];
        let seven = list[i + 6];
        let eight = list[i + 7];
        let nine = list[i + 8];
        let ten = list[i + 9];
        let eleven = list[i + 10];
        let twelve = list[i + 11];
        let thirteen = list[i + 12];
        let fourteen = list[i + 13];
        let fifteen = list[i + 14];
        let sixteen = list[i + 15];
        if (i % 8 === 0 && list.length % 8 === 0) {
          if (activeRound === 4)
            set.push(one, eight, two, seven, three, six, four, five);
          if (activeRound === 5)
            set.push(seven, one, two, eight, five, three, four, six);
          if (activeRound === 6)
            set.push(one, five, six, two, three, seven, eight, four);
          if (activeRound === 7)
            set.push(five, one, two, five, eight, three, four, seven);
          if (activeRound === 8)
            set.push(
              one,
              sixteen,
              two,
              fifteen,
              three,
              fourteen,
              four,
              thirteen,
              five,
              twelve,
              six,
              eleven,
              seven,
              ten,
              eight,
              nine
            );
          if (activeRound === 9)
            set.push(
              one,
              fifteen,
              two,
              sixteen,
              three,
              thirteen,
              four,
              fourteen,
              five,
              eleven,
              six,
              twelve,
              seven,
              nine,
              eight,
              ten
            );
          if (activeRound === 10)
            set.push(
              one,
              fourteen,
              two,
              thirteen,
              three,
              sixteen,
              four,
              fifteen,
              five,
              nine,
              six,
              ten,
              seven,
              eleven,
              eight,
              twelve
            );
          if (activeRound === 11)
            set.push(
              one,
              thirteen,
              two,
              fourteen,
              three,
              fifteen,
              four,
              sixteen,
              five,
              ten,
              six,
              nine,
              seven,
              twelve,
              eight,
              eleven
            );
          if (activeRound === 12)
            set.push(
              one,
              twelve,
              two,
              eleven,
              three,
              ten,
              four,
              nine,
              five,
              fifteen,
              six,
              sixteen,
              seven,
              thirteen,
              eight,
              fourteen
            );
          if (activeRound === 13)
            set.push(
              one,
              eleven,
              two,
              twelve,
              three,
              nine,
              four,
              ten,
              five,
              sixteen,
              six,
              fifteen,
              seven,
              fourteen,
              eight,
              thirteen
            );
          if (activeRound === 14)
            set.push(
              one,
              ten,
              two,
              nine,
              three,
              twelve,
              four,
              eleven,
              five,
              thirteen,
              six,
              fourteen,
              seven,
              fifteen,
              eight,
              sixteen
            );
          if (activeRound === 15)
            set.push(
              one,
              nine,
              two,
              ten,
              three,
              eleven,
              four,
              twelve,
              five,
              fourteen,
              six,
              thirteen,
              seven,
              sixteen,
              eight,
              fifteen
            );
        }
      }
      list = set;
    }

    return list;
  };

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
