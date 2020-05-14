import { UPDATE_TOURNAMENT, UPDATE_TOURNAMENTS } from "./actionTypes";

export const updateTournament = (payload) => {
  return { type: UPDATE_TOURNAMENT, payload };
};

export const updateTournaments = (payload) => {
  return { type: UPDATE_TOURNAMENTS, payload };
};
