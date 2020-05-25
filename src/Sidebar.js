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

  const { tournaments, account } = useSelector((state) => ({
    tournaments: state.pickleball.tournaments,
    account: state.pickleball.account,
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

  let currentDate = new Date();

  const convertBirthdate = (t) => {
    let month = account.birthdate.substring(5, 7);
    let day = account.birthdate.substring(8, 10);
    let year = account.birthdate.substring(0, 4);
    let dateTimestamp = new Date(`${month}/${day}/${year}`);
    let dateMonth = dateTimestamp.getMonth();
    let dateDay = dateTimestamp.getDate();
    let dateYear = dateTimestamp.getFullYear();
    return currentDate.getFullYear() - dateYear;
  };

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
          ((selectedSkillFilter === "mySkill"
            ? t.skill[0] <= account.skill
            : null) ||
            (selectedSkillFilter === "" ? t : null)) &&
          ((selectedAgeFilter === "myAge"
            ? t.minAge <= convertBirthdate()
            : null) ||
            (selectedAgeFilter === "" ? t : null)) &&
          ((selectedGenderFilter === "mens" ? t.gender === "Mens" : null) ||
            (selectedGenderFilter === "womens"
              ? t.gender === "Womens"
              : null) ||
            (((selectedGenderFilter === "mixed"
              ? t.gender === "Mixed"
              : null) ||
              (selectedGenderFilter === "" ? t : null)) &&
              (selectedFeeFilter === "free" ? t.fee === 0 : null)) ||
            (selectedFeeFilter === "entryFee" ? t.fee !== 0 : null) ||
            (selectedFeeFilter === "" ? t : null))
      );
      dispatch(updateTournaments(returnValue));
      console.log(account);
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
              <div>Tournament Date</div>
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
            <div>Tournament Date</div>
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
              {selectedSkillFilter === "mySkill" ? (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>My Skill</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedSkillFilter("mySkill")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>My Skill</div>
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
              <div>Age</div>
            </div>
            <div className="categories">
              {selectedAgeFilter === "myAge" ? (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>My Age</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedAgeFilter("myAge")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>My Age</div>
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
            <div>Age</div>
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
              <div>Cost</div>
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
              {selectedFeeFilter === "entryFee" ? (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("")}
                >
                  <img src="check.svg" alt="selected filter" />
                  <div>Entry Fee</div>
                </div>
              ) : (
                <div
                  className="category"
                  onClick={() => setSelectedFeeFilter("entryFee")}
                >
                  <img
                    src="check.svg"
                    alt="selected filter"
                    className="hidden"
                  />
                  <div>Entry Fee</div>
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
            <div>Cost</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
