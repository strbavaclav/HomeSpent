import User from '../../models/user';

export const CREATE_USER = 'CREATE_USER';
export const SET_USERS = 'SET_USERS';
export const UPDATE_USER = 'UPDATE_USER';

//načíst uživatele
export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://bp-app-dba2c.firebaseio.com/users.json`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const resData = await response.json();
      const loadedUsers = [];

      for (const key in resData) {
        loadedUsers.push(
          new User(
            key,
            resData[key].authId,
            resData[key].email,
            resData[key].name,
            resData[key].phone,
            resData[key].country,
            resData[key].tabs
          )
        );
      }

      dispatch({
        type: SET_USERS,
        users: loadedUsers,
      });
    } catch (err) {
      throw err;
    }
  };
};

//vytvoření uživatele
export const createUser = (email, name, phone, country, tabs) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const authId = getState().auth.userId;
    const response = await fetch(
      `https://bp-app-dba2c.firebaseio.com/users.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authId,
          email,
          name,
          phone,
          country,
          tabs,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_USER,
      userData: {
        id: resData.name,
        authId: authId,
        email: email,
        name: name,
        phone: phone,
        country: country,
        tabs: tabs,
      },
    });
  };
};

//upravid uživatele
export const updateUser = (id, name, phone, country, tabs) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/users/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, country, tabs }),
      }
    );
    dispatch({
      type: UPDATE_USER,
      userId: id,
      userData: {
        name: name,
        phone: phone,
        country: country,
        tabs: tabs,
      },
    });
  };
};
