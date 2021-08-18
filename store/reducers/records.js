import Record from '../../models/record';

import {
  CREATE_RECORD,
  DELETE_RECORD,
  UPDATE_RECORD,
  SET_RECORDS,
} from '../actions/records';

const initialState = {
  records: [],
};

const recordsReducer = (state = initialState, action) => {
  switch (action.type) {
    //načtení záznamů
    case SET_RECORDS:
      return {
        records: action.records,
      };

    //smazat záznamy
    case DELETE_RECORD:
      return {
        ...state,
        records: state.records.filter(
          (record) => record.id !== action.recordId
        ),
      };

    //přidat záznam
    case CREATE_RECORD:
      const newRecord = new Record(
        action.recordData.id,
        action.recordData.name,
        action.recordData.comodityId,
        action.recordData.userId,
        action.recordData.date,
        action.recordData.note,
        action.recordData.category,
        action.recordData.price,
        action.recordData.priceType,
        action.recordData.sharedWith,
        action.recordData.shareStatus
      );
      return { ...state, records: state.records.concat(newRecord) };

    //upravit záznam
    case UPDATE_RECORD:
      const recordIndex = state.records.findIndex(
        (record) => record.id === action.recordId
      );
      const updatedRecord = new Record(
        action.recordId,
        action.recordData.name,
        state.records[recordIndex].comodityId,
        action.userId,
        action.recordData.date,
        action.recordData.note,
        action.recordData.category,
        action.recordData.price,
        action.recordData.priceType,
        action.recordData.sharedWith,
        action.recordData.shareStatus
      );
      const updatedRecords = [...state.records];
      updatedRecords[recordIndex] = updatedRecord;
      return { ...state, records: updatedRecords };

    default:
      return state;
  }
};

export default recordsReducer;
