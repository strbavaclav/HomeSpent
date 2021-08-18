import Comodity from '../../models/comodity';

export const DELETE_COMODITY = 'DELETE_COMODITY';
export const CREATE_COMODITY = 'CREATE_COMODITY';
export const UPDATE_TENANT_COMODITY = 'UPDATE_TENANT_COMODITY';
export const UPDATE_WARDEN_COMODITY = 'UPDATE_WARDEN_COMODITY';
export const JOIN_WARDEN_COMODITY = 'JOIN_WARDEN_COMODITY';
export const JOIN_TENANT_COMODITY = 'JOIN_TENANT_COMODITY';
export const SET_COMODITIES = 'SET_COMODITIES';
export const DISSBOUND_TENANT_COMODITY = 'DISSBOUND_TENANT_COMODITY';
export const DISSBOUND_WARDEN_COMODITY = 'DISSBOUND_WARDEN_COMODITY';


//načíst nemovitosti
export const fetchComodities = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://bp-app-dba2c.firebaseio.com/comodities.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const resData = await response.json();
      const loadedComodities = [];

      for (const key in resData) {
        loadedComodities.push(
          new Comodity(
            key,
            resData[key].wardenId,
            resData[key].tenantId,
            resData[key].name,
            resData[key].address,
            resData[key].description,
            resData[key].currency
          )
        );
      }
      dispatch({
        type: SET_COMODITIES,
        comodities: loadedComodities,
        wardenComodities: loadedComodities.filter(
          (com) => com.wardenId === userId
        ),
        tenantComodities: loadedComodities.filter(
          (com) => com.tenantId === userId
        ),
      });
    } catch (err) {
      throw err;
    }
  };
};

//smezat nemovitost
export const deleteComodity = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities/${id}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );
    dispatch({ type: DELETE_COMODITY, comodityId: id });
  };
};

//vytvořit najímanou nemovitost
export const createTenantComodity = (name, address, description, currency) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          description,
          wardenId: '',
          tenantId: userId,
          currency,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_COMODITY,
      comodityData: {
        id: resData.name,
        name: name,
        address: address,
        description: description,
        wardenId: '',
        tenantId: userId,
        currency: currency,
      },
    });
  };
};

//vytvořit vlastněnou nemovitost
export const createWardenComodity = (name, address, description, currency) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          description,
          wardenId: userId,
          tenantId: '',
          currency,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_COMODITY,
      comodityData: {
        id: resData.name,
        name: name,
        address: address,
        description: description,
        wardenId: userId,
        tenantId: '',
        currency: currency,
      },
    });
  };
};

//upravit najímanou nemovitost
export const updateTenantComodity = (id, name, address, description) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, address, description }),
      }
    );
    dispatch({
      type: UPDATE_TENANT_COMODITY,
      comodityId: id,
      comodityData: {
        name: name,
        address: address,
        description: description,
      },
    });
  };
};

//upravit vlastněnou nemovitost
export const updateWardenComodity = (
  id,
  name,
  address,
  description,
  tenantId
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          description,
          tenantId,
        }),
      }
    );
    dispatch({
      type: UPDATE_WARDEN_COMODITY,
      comodityId: id,
      comodityData: {
        name: name,
        address: address,
        description: description,
        tenantId: tenantId,
      },
    });
  };
};

//připojit se k jako vlastník
export const JoinWardenComodity = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const wardenId = getState().auth.userId;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wardenId,
        }),
      }
    );
    dispatch({
      type: JOIN_WARDEN_COMODITY,
      comodityId: id,
      comodityData: {
        wardenId: wardenId,
      },
    });
  };
};

//připojit se k nemovitosti jako nájemník
export const JoinTenantComodity = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const tenantId = getState().auth.userId;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
        }),
      }
    );
    dispatch({
      type: JOIN_TENANT_COMODITY,
      comodityId: id,
      comodityData: {
        tenantId: tenantId,
      },
    });
  };
};

//odpojit se od najímané nemovitosti
export const DissboundTenantComodity = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const tenantId = '';
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
        }),
      }
    );
    dispatch({
      type: DISSBOUND_TENANT_COMODITY,
      comodityId: id,
      comodityData: {
        tenantId: tenantId,
      },
    });
  };
};

//odpojit se od vlastněné nemovitosti
export const DissboundWardenComodity = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const wardenId = '';
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/comodities/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wardenId,
        }),
      }
    );
    dispatch({
      type: DISSBOUND_WARDEN_COMODITY,
      comodityId: id,
      comodityData: {
        tenantId: wardenId,
      },
    });
  };
};
