import {
  UPDATE_TOURNAMENT,
  UPDATE_TOURNAMENTS,
  UPDATE_ACCOUNT,
  UPDATE_IDS,
} from "../actions/actionTypes";
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

    case UPDATE_ACCOUNT: {
      return {
        ...state,
        account: { ...state.account, ...action.payload },
      };
    }
    case UPDATE_IDS: {
      return { ...state, ids: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default pickleball;
