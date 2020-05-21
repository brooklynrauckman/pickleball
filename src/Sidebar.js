import React, { useState, useEffect } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { updateTournaments } from "./redux/actions/actions";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

const Sidebar = () => {
  const dispatch = useDispatch();

  const [all] = useCollection(firebase.firestore().collection("tournaments"));

  const { tournaments } = useSelector((state) => ({
    tournaments: state.pickleball.tournaments,
  }));
  const [openFilters, setOpenFilters] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("");

  useEffect(() => {
    const filterTourneys = async () => {
      const querySnapshot = await all.docs[0].get("tournaments");
      let returnValue = tournaments;

      if (selectedDateFilter === "past")
        returnValue = querySnapshot.filter(
          (t) => new Date(t.date).getTime() < new Date().getTime()
        );
      if (selectedDateFilter === "week")
        returnValue = querySnapshot.filter(
          (t) =>
            new Date(t.date).getTime() > new Date().getTime() &&
            new Date(t.date).getTime() < new Date().getTime() + 604800000
        );

      if (selectedDateFilter === "month")
        returnValue = querySnapshot.filter(
          (t) =>
            new Date(t.date).getTime() > new Date().getTime() &&
            new Date(t.date).getTime() < new Date().getTime() + 2592000000
        );
      if (selectedDateFilter === "twoMonth")
        returnValue = querySnapshot.filter(
          (t) =>
            new Date(t.date).getTime() > new Date().getTime() &&
            new Date(t.date).getTime() < new Date().getTime() + 5184000000
        );
      if (selectedDateFilter === "future")
        returnValue = querySnapshot.filter(
          (t) => new Date(t.date).getTime() > new Date().getTime() + 5184000000
        );

      if (selectedLocationFilter === "ks")
        returnValue = querySnapshot.filter(
          (t) => t.state === "Kansas" || t.state === "KS"
        );

      if (selectedLocationFilter === "ks" && selectedDateFilter === "past")
        returnValue = querySnapshot.filter(
          (t) =>
            (t.state === "Kansas" || t.state === "KS") &&
            new Date(t.date).getTime() < new Date().getTime()
        );
      if (selectedLocationFilter === "ks" && selectedDateFilter === "week")
        returnValue = querySnapshot.filter(
          (t) =>
            (t.state === "Kansas" || t.state === "KS") &&
            new Date(t.date).getTime() > new Date().getTime() &&
            new Date(t.date).getTime() < new Date().getTime() + 604800000
        );
      if (selectedLocationFilter === "ks" && selectedDateFilter === "month")
        returnValue = querySnapshot.filter(
          (t) =>
            (t.state === "Kansas" || t.state === "KS") &&
            new Date(t.date).getTime() > new Date().getTime() &&
            new Date(t.date).getTime() < new Date().getTime() + 2592000000
        );
      if (selectedLocationFilter === "ks" && selectedDateFilter === "twoMonth")
        returnValue = querySnapshot.filter(
          (t) =>
            (t.state === "Kansas" || t.state === "KS") &&
            new Date(t.date).getTime() > new Date().getTime() &&
            new Date(t.date).getTime() < new Date().getTime() + 5184000000
        );
      if (selectedLocationFilter === "ks" && selectedDateFilter === "future")
        returnValue = querySnapshot.filter(
          (t) =>
            (t.state === "Kansas" || t.state === "KS") &&
            new Date(t.date).getTime() > new Date().getTime() + 5184000000
        );

      dispatch(updateTournaments(returnValue));
    };
    if (all) filterTourneys();
  }, [selectedDateFilter, selectedLocationFilter, all]);

  return (
    <div className="sidebar">
      <div className="search-wrapper">
        <input
          className="search"
          type="text"
          placeholder="Search for a tournament..."
        />
      </div>
      <div className="filters">
        {!!openFilters.filter((f) => f === "date").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) =>
                  setOpenFilters(openFilters.filter((f) => f !== "date"))
                }
              >
                -
              </div>
              <div>Date</div>
            </div>
            <div className="categories">
              {selectedDateFilter === "past" ? (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Past</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("past")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Past</div>
                </div>
              )}
              {selectedDateFilter === "week" ? (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Within 7 days</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("week")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Within 7 days</div>
                </div>
              )}
              {selectedDateFilter === "month" ? (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Within 30 days</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("month")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Within 30 days</div>
                </div>
              )}
              {selectedDateFilter === "twoMonth" ? (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Within 60 days</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("twoMonth")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Within 60 days</div>
                </div>
              )}
              {selectedDateFilter === "future" ? (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>+60 days</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedDateFilter("future")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>+60 days</div>
                </div>
              )}
            </div>
          </React.Fragment>
        ) : (
          <div className="filter">
            <div
              className="expand"
              onClick={(e) => setOpenFilters([...openFilters, "date"])}
            >
              +
            </div>
            <div>Date</div>
          </div>
        )}
        {!!openFilters.filter((f) => f === "location").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) =>
                  setOpenFilters(openFilters.filter((f) => f !== "location"))
                }
              >
                -
              </div>
              <div>Location</div>
            </div>
            <div className="categories">
              {selectedLocationFilter === "ks" ? (
                <div
                  className="category"
                  onClick={() => setSelectedLocationFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Kansas</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedLocationFilter("ks")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Kansas</div>
                </div>
              )}
              <div>Missouri</div>
              <div>Other</div>
            </div>
          </React.Fragment>
        ) : (
          <div className="filter">
            <div
              className="expand"
              onClick={(e) => setOpenFilters([...openFilters, "location"])}
            >
              +
            </div>
            <div>Location</div>
          </div>
        )}
        {!!openFilters.filter((f) => f === "type").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) =>
                  setOpenFilters(openFilters.filter((f) => f !== "type"))
                }
              >
                -
              </div>
              <div>Round-Robin Type</div>
            </div>
            <div className="categories">
              <div>Modified</div>
              <div>Full</div>
            </div>
          </React.Fragment>
        ) : (
          <div className="filter">
            <div
              className="expand"
              onClick={(e) => setOpenFilters([...openFilters, "type"])}
            >
              +
            </div>
            <div>Round-Robin Type</div>
          </div>
        )}
        {!!openFilters.filter((f) => f === "skill").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) =>
                  setOpenFilters(openFilters.filter((f) => f !== "skill"))
                }
              >
                -
              </div>
              <div>Skill Level</div>
            </div>
            <div className="categories">
              <div>0-1.5</div>
              <div>2-3</div>
              <div>3.5-4.5</div>
              <div>5-6</div>
              <div>All</div>
            </div>
          </React.Fragment>
        ) : (
          <div className="filter">
            <div
              className="expand"
              onClick={(e) => setOpenFilters([...openFilters, "skill"])}
            >
              +
            </div>
            <div>Skill Level</div>
          </div>
        )}
        {!!openFilters.filter((f) => f === "age").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) =>
                  setOpenFilters(openFilters.filter((f) => f !== "age"))
                }
              >
                -
              </div>
              <div>Minimum Age</div>
            </div>
            <div className="categories">
              <div>0-10</div>
              <div>11-20</div>
              <div>21-30</div>
              <div>31-40</div>
              <div>41-50</div>
              <div>51-60</div>
              <div>61+</div>
            </div>
          </React.Fragment>
        ) : (
          <div className="filter">
            <div
              className="expand"
              onClick={(e) => setOpenFilters([...openFilters, "age"])}
            >
              +
            </div>
            <div>Minimum Age</div>
          </div>
        )}
        {!!openFilters.filter((f) => f === "gender").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) =>
                  setOpenFilters(openFilters.filter((f) => f !== "gender"))
                }
              >
                -
              </div>
              <div>Gender</div>
            </div>
            <div className="categories">
              <div>Male</div>
              <div>Female</div>
              <div>Mixed</div>
            </div>
          </React.Fragment>
        ) : (
          <div className="filter">
            <div
              className="expand"
              onClick={(e) => setOpenFilters([...openFilters, "gender"])}
            >
              +
            </div>
            <div>Gender</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
