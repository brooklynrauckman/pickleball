import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

const Nav = (props) => {
  const { navToggle, updateNavToggle } = props;
  return (
    <React.Fragment>
      {navToggle === false ? (
        <svg
          className="options-nav"
          onClick={() => updateNavToggle(!navToggle)}
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
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
      ) : (
        <div className="login-nav">
          <svg
            className="options-nav"
            onClick={() => updateNavToggle(!navToggle)}
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
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
          <Link
            to="/tourneys"
            className="remove-decoration"
            onClick={() => updateNavToggle(!navToggle)}
          >
            <div className="link">View Tournaments</div>
          </Link>
          <Link
            to="/create"
            className="remove-decoration"
            onClick={() => updateNavToggle(!navToggle)}
          >
            <div className="link">Create New Tournament</div>
          </Link>
        </div>
      )}
    </React.Fragment>
  );
};

export default Nav;
