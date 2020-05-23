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
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("");
  const [selectedAgeFilter, setSelectedAgeFilter] = useState("");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("");
  const [selectedFeeFilter, setSelectedFeeFilter] = useState("");
  const [search, updateSearch] = useState("");

  useEffect(() => {
    const filterTourneys = async () => {
      const querySnapshot = await all.docs[0].get("tournaments");
      let returnValue = tournaments;

      returnValue = querySnapshot.filter(
        (t) =>
          ((t.title.toLowerCase().includes(search.toLowerCase())
            ? t.title.toLowerCase().includes(search.toLowerCase())
            : null) ||
            (t.venue.toLowerCase().includes(search.toLowerCase())
              ? t.venue.toLowerCase().includes(search.toLowerCase())
              : null) ||
            (t.organizer.toLowerCase().includes(search.toLowerCase())
              ? t.organizer.toLowerCase().includes(search.toLowerCase())
              : null) ||
            (search === "" ? t : null)) &&
          ((selectedDateFilter === "past"
            ? new Date(t.date).getTime() < new Date().getTime()
            : null) ||
            (selectedDateFilter === "week"
              ? new Date(t.date).getTime() > new Date().getTime() &&
                new Date(t.date).getTime() < new Date().getTime() + 604800000
              : null) ||
            (selectedDateFilter === "month"
              ? new Date(t.date).getTime() > new Date().getTime() &&
                new Date(t.date).getTime() < new Date().getTime() + 2592000000
              : null) ||
            (selectedDateFilter === "twoMonth"
              ? new Date(t.date).getTime() > new Date().getTime() &&
                new Date(t.date).getTime() < new Date().getTime() + 5184000000
              : null) ||
            (selectedDateFilter === "future"
              ? new Date(t.date).getTime() > new Date().getTime() + 5184000000
              : null) ||
            (selectedDateFilter === "" ? t : null)) &&
          ((selectedLocationFilter === "ks"
            ? t.state === "Kansas" || t.state === "KS"
            : null) ||
            (selectedLocationFilter === "mo"
              ? t.state === "Missouri" || t.state === "MO"
              : null) ||
            (selectedLocationFilter === "otherState"
              ? t.state !== "Missouri" &&
                t.state !== "Kansas" &&
                t.state !== "MO" &&
                t.state !== "KS"
              : null) ||
            (selectedLocationFilter === "" ? t : null)) &&
          ((selectedTypeFilter === "modified" ? t.type === "Modified" : null) ||
            (selectedTypeFilter === "full" ? t.type === "Full" : null) ||
            (selectedTypeFilter === "" ? t : null)) &&
          ((selectedSkillFilter === "0-3" ? t.skill[1] <= 3 : null) ||
            (selectedSkillFilter === "2-5"
              ? t.skill[0] >= 2 && t.skill[1] <= 5
              : null) ||
            (selectedSkillFilter === "3-6"
              ? t.skill[0] >= 3 && t.skill[1] <= 6
              : null) ||
            (selectedSkillFilter === "All"
              ? t.skill[0] === 0 && t.skill[1] === 6
              : null) ||
            (selectedSkillFilter === "" ? t : null)) &&
          ((selectedAgeFilter === "0-10" ? t.minAge <= 10 : null) ||
            (selectedAgeFilter === "11-20"
              ? t.minAge >= 11 && t.minAge <= 20
              : null) ||
            (selectedAgeFilter === "21-30"
              ? t.minAge >= 21 && t.minAge <= 30
              : null) ||
            (selectedAgeFilter === "31-40"
              ? t.minAge >= 31 && t.minAge <= 40
              : null) ||
            (selectedAgeFilter === "41-50"
              ? t.minAge >= 41 && t.minAge <= 50
              : null) ||
            (selectedAgeFilter === "51-60"
              ? t.minAge >= 51 && t.minAge <= 60
              : null) ||
            (selectedAgeFilter === "61+" ? t.minAge >= 61 : null) ||
            (selectedAgeFilter === "" ? t : null)) &&
          ((selectedGenderFilter === "mens" ? t.gender === "Mens" : null) ||
            (selectedGenderFilter === "womens"
              ? t.gender === "Womens"
              : null) ||
            (selectedGenderFilter === "mixed" ? t.gender === "Mixed" : null) ||
            (selectedGenderFilter === "" ? t : null)) &&
          ((selectedFeeFilter === "free" ? t.fee === 0 : null) ||
            (selectedFeeFilter === "0-10" ? t.fee <= 10 : null) ||
            (selectedFeeFilter === "10-20"
              ? t.fee >= 10 && t.fee <= 20
              : null) ||
            (selectedFeeFilter === "20-50"
              ? t.fee >= 20 && t.fee <= 50
              : null) ||
            (selectedFeeFilter === "50+" ? t.fee >= 50 : null) ||
            (selectedFeeFilter === "" ? t : null))
      );
      dispatch(updateTournaments(returnValue));
    };
    if (all) filterTourneys();
  }, [
    selectedDateFilter,
    selectedLocationFilter,
    selectedTypeFilter,
    selectedSkillFilter,
    selectedAgeFilter,
    selectedGenderFilter,
    selectedFeeFilter,
    all,
    search,
  ]);

  return (
    <div className="sidebar">
      <div className="search-wrapper">
        <input
          className="search"
          type="text"
          placeholder="Search for a tournament..."
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
        />
        <div className="clear-search" onClick={(e) => updateSearch("")}>
          X
        </div>
      </div>
      <div
        className="clear-filters"
        onClick={() => {
          setSelectedAgeFilter("");
          setSelectedTypeFilter("");
          setSelectedDateFilter("");
          setSelectedSkillFilter("");
          setSelectedGenderFilter("");
          setSelectedLocationFilter("");
          setOpenFilters([]);
        }}
      >
        Clear filters
      </div>
      <div className="filters">
        {!!openFilters.filter((f) => f === "date").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) => {
                  setOpenFilters(openFilters.filter((f) => f !== "date"));
                  setSelectedDateFilter("");
                }}
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
                onClick={(e) => {
                  setOpenFilters(openFilters.filter((f) => f !== "location"));
                  setSelectedLocationFilter("");
                }}
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
              {selectedLocationFilter === "mo" ? (
                <div
                  className="category"
                  onClick={() => setSelectedLocationFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Missouri</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedLocationFilter("mo")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Missouri</div>
                </div>
              )}
              {selectedLocationFilter === "otherState" ? (
                <div
                  className="category"
                  onClick={() => setSelectedLocationFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Other</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedLocationFilter("otherState")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Other</div>
                </div>
              )}
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
                onClick={(e) => {
                  setOpenFilters(openFilters.filter((f) => f !== "type"));
                  setSelectedTypeFilter("");
                }}
              >
                -
              </div>
              <div>Round-Robin Type</div>
            </div>
            <div className="categories">
              {selectedTypeFilter === "modified" ? (
                <div
                  className="category"
                  onClick={() => setSelectedTypeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Modified</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedTypeFilter("modified")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Modified</div>
                </div>
              )}
              {selectedTypeFilter === "full" ? (
                <div
                  className="category"
                  onClick={() => setSelectedTypeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Full</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedTypeFilter("full")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Full</div>
                </div>
              )}
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
                onClick={(e) => {
                  setOpenFilters(openFilters.filter((f) => f !== "skill"));
                  setSelectedSkillFilter("");
                }}
              >
                -
              </div>
              <div>Skill Level</div>
            </div>
            <div className="categories">
              {selectedSkillFilter === "0-3" ? (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>0-3</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("0-3")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>0-3</div>
                </div>
              )}
              {selectedSkillFilter === "2-5" ? (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>2-5</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("2-5")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>2-5</div>
                </div>
              )}
              {selectedSkillFilter === "3-6" ? (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>3-6</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("3-6")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>3-6</div>
                </div>
              )}
              {selectedSkillFilter === "All" ? (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>All</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("All")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>All</div>
                </div>
              )}
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
                onClick={(e) => {
                  setOpenFilters(openFilters.filter((f) => f !== "age"));
                  setSelectedAgeFilter("");
                }}
              >
                -
              </div>
              <div>Minimum Age</div>
            </div>
            <div className="categories">
              {selectedAgeFilter === "0-10" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>0-10</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("0-10")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>0-10</div>
                </div>
              )}
              {selectedAgeFilter === "11-20" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>11-20</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("11-20")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>11-20</div>
                </div>
              )}
              {selectedAgeFilter === "21-30" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>21-30</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("21-30")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>21-30</div>
                </div>
              )}

              {selectedAgeFilter === "31-40" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>31-40</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("31-40")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>31-40</div>
                </div>
              )}
              {selectedAgeFilter === "41-50" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>41-50</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("41-50")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>41-50</div>
                </div>
              )}
              {selectedAgeFilter === "51-60" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>51-60</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("51-60")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>51-60</div>
                </div>
              )}
              {selectedAgeFilter === "61+" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>61+</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("61+")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>61+</div>
                </div>
              )}
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
                onClick={(e) => {
                  setOpenFilters(openFilters.filter((f) => f !== "gender"));
                  setSelectedGenderFilter("");
                }}
              >
                -
              </div>
              <div>Gender</div>
            </div>
            <div className="categories">
              {selectedGenderFilter === "mens" ? (
                <div
                  className="category"
                  onClick={() => setSelectedGenderFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Mens</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedGenderFilter("mens")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Mens</div>
                </div>
              )}
              {selectedGenderFilter === "womens" ? (
                <div
                  className="category"
                  onClick={() => setSelectedGenderFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Womens</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedGenderFilter("womens")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Womens</div>
                </div>
              )}
              {selectedGenderFilter === "mixed" ? (
                <div
                  className="category"
                  onClick={() => setSelectedGenderFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Mixed</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedGenderFilter("mixed")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Mixed</div>
                </div>
              )}
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
        {!!openFilters.filter((f) => f === "fee").length ? (
          <React.Fragment>
            <div className="filter">
              <div
                className="expand"
                onClick={(e) => {
                  setOpenFilters(openFilters.filter((f) => f !== "fee"));
                  setSelectedFeeFilter("");
                }}
              >
                -
              </div>
              <div>Fee</div>
            </div>
            <div className="categories">
              {selectedFeeFilter === "free" ? (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Free</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("free")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Free</div>
                </div>
              )}
              {selectedFeeFilter === "0-10" ? (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>$0-10</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("0-10")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>$0-10</div>
                </div>
              )}
              {selectedFeeFilter === "10-20" ? (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>$10-20</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("10-20")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>$10-20</div>
                </div>
              )}
              {selectedFeeFilter === "20-50" ? (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>$20-50</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("20-50")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>$20-50</div>
                </div>
              )}
              {selectedFeeFilter === "50+" ? (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>$50+</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("50+")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>$50+</div>
                </div>
              )}
            </div>
          </React.Fragment>
        ) : (
          <div className="filter">
            <div
              className="expand"
              onClick={(e) => setOpenFilters([...openFilters, "fee"])}
            >
              +
            </div>
            <div>Fee</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
