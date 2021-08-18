import Record from '../../models/record';

export const DELETE_RECORD = 'DELETE_RECORD';
export const CREATE_RECORD = 'CREATE_RECORD';
export const UPDATE_RECORD = 'UPDATE_RECORD';
export const SET_RECORDS = 'SET_RECORDS';

//načíst záznamy
export const fetchRecords = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://bp-app-dba2c.firebaseio.com/records.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const resData = await response.json();
      const loadedRecords = [];

      for (const key in resData) {
        loadedRecords.push(
          new Record(
            key,
            resData[key].name,
            resData[key].comodityId,
            resData[key].userId,
            resData[key].date,
            resData[key].note,
            resData[key].category,
            resData[key].price,
            resData[key].priceType,
            resData[key].sharedWith,
            resData[key].shareStatus
          )
        );
      }
      dispatch({
        type: SET_RECORDS,
        records: loadedRecords,
      });
    } catch (err) {
      throw err;
    }
  };
};

//smazat záznamy
export const deleteRecord = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/records/${id}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );
    dispatch({ type: DELETE_RECORD, recordId: id });
  };
};


//vytvořit záznam
export const createRecord = (
  comodityId,
  name,
  userId,
  date,
  note,
  category,
  price,
  priceType,
  sharedWith,
  shareStatus
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://bp-app-dba2c.firebaseio.com/records.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comodityId,
          name,
          userId,
          date,
          note,
          category,
          price,
          priceType,
          sharedWith,
          shareStatus,
        }),
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_RECORD,
      recordData: {
        id: resData.name,
        name: name,
        comodityId: comodityId,
        userId: userId,
        date: date,
        note: note,
        category: category,
        price: price,
        priceType: priceType,
        sharedWith: sharedWith,
        shareStatus: shareStatus,
      },
    });
  };
};

//upravit záznam
export const updateRecord = (
  id,
  name,
  userId,
  date,
  note,
  category,
  price,
  priceType,
  sharedWith,
  shareStatus
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    await fetch(
      `https://bp-app-dba2c.firebaseio.com/records/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          userId,
          date,
          note,
          category,
          price,
          priceType,
          sharedWith,
          shareStatus,
        }),
      }
    );
    dispatch({
      type: UPDATE_RECORD,
      recordId: id,
      recordData: {
        name: name,
        userId: userId,
        date: date,
        note: note,
        category: category,
        price: price,
        priceType: priceType,
        sharedWith: sharedWith,
        shareStatus: shareStatus,
      },
    });
  };
};
