import User from '../../models/user';

import { CREATE_USER, SET_USERS, UPDATE_USER } from '../actions/user';

const initialState = {
  users: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    //načtení uživatelů
    case SET_USERS:
      return {
        users: action.users,
      };
  //přidání uživatele
    case CREATE_USER:
      const newUser = new User(
        action.userData.id,
        action.userData.authId,
        action.userData.email,
        action.userData.name,
        action.userData.phone,
        action.userData.country,
        action.userData.tabs
      );
      return { ...state, users: state.users.concat(newUser) };
  
      //aktualizace dat uživatele
    case UPDATE_USER:
      const UserIndex = state.users.findIndex(
        (user) => user.id === action.userId
      );
      const updatedUser = new User(
        action.userId,
        state.users[UserIndex].authId,
        state.users[UserIndex].email,
        action.userData.name,
        action.userData.phone,
        action.userData.country,
        action.userData.tabs
      );
      const updatedUsers = [...state.users];
      updatedUsers[UserIndex] = updatedUser;
      return { ...state, users: updatedUsers };

    default:
      return state;
  }
};

export default usersReducer;
