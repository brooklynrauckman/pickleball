import {
  UPDATE_TOURNAMENT,
  UPDATE_TOURNAMENTS,
  UPDATE_ACCOUNT,
  UPDATE_IDS,
} from "./actionTypes";

export const updateTournament = (payload) => {
  return { type: UPDATE_TOURNAMENT, payload };
};

export const updateTournaments = (payload) => {
  return { type: UPDATE_TOURNAMENTS, payload };
};

export const updateAccount = (payload) => {
  return { type: UPDATE_ACCOUNT, payload };
};

export const updateIds = (payload) => {
  return { type: UPDATE_IDS, payload };
};
