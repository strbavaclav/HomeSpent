import { AUTHENTICATE, SET_DID_TRY_AL, LOGOUT } from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    //přihlášení
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
      };

    //odhlášení
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true,
      };

    //inicializase přihlášeného uživatele
    case SET_DID_TRY_AL:
      return { ...state, didTryAutoLogin: true };

    default:
      return state;
  }
};
