import { UPDATE_TOURNAMENT, UPDATE_TOURNAMENTS } from "../actions/actionTypes";
import { initialState } from "../constants/initialState";

const pickleball = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TOURNAMENT: {
      return {
        ...state,
        tournament: { ...state.tournament, ...action.payload },
      };
    }
    case UPDATE_TOURNAMENTS: {
      return { ...state, tournaments: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default pickleball;
