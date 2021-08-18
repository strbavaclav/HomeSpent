import Comodity from '../../models/comodity';
import {
  DELETE_COMODITY,
  CREATE_COMODITY,
  UPDATE_TENANT_COMODITY,
  UPDATE_WARDEN_COMODITY,
  JOIN_WARDEN_COMODITY,
  JOIN_TENANT_COMODITY,
  SET_COMODITIES,
  DISSBOUND_TENANT_COMODITY,
  DISSBOUND_WARDEN_COMODITY,
} from '../actions/comodities';

const initialState = {
  comodities: [],
  tenantCom: [],
  wardenCom: [],
};

const comoditiesReducer = (state = initialState, action) => {
  switch (action.type) {
    
    //načtení nemovitostí
    case SET_COMODITIES:
      return {
        comodities: action.comodities,
        tenantCom: action.tenantComodities,
        wardenCom: action.wardenComodities,
      };
    
    //smazat nemovitost
    case DELETE_COMODITY:
      return {
        ...state,
        comodities: state.comodities.filter(
          (comodity) => comodity.id !== action.comodityId
        ),
      };
    
    //přidat nemovitost
    case CREATE_COMODITY:
      const newComodity = new Comodity(
        action.comodityData.id,
        action.comodityData.wardenId,
        action.comodityData.tenantId,
        action.comodityData.name,
        action.comodityData.address,
        action.comodityData.description,
        action.comodityData.currency
      );
      return { ...state, comodities: state.comodities.concat(newComodity) };
    
    //upravit najímanou nemovitost
    case UPDATE_TENANT_COMODITY:
      const TenantComodityIndex = state.tenantCom.findIndex(
        (comodity) => comodity.id === action.comodityId
      );
      const updatedTenantComodity = new Comodity(
        action.comodityId,
        state.tenantCom[TenantComodityIndex].wardenId,
        state.tenantCom[TenantComodityIndex].tenantId,
        action.comodityData.name,
        action.comodityData.address,
        action.comodityData.description,
        state.tenantCom[TenantComodityIndex].currency
      );
      const updatedTenantComodities = [...state.tenantCom];
      updatedTenantComodities[TenantComodityIndex] = updatedTenantComodity;
      return { ...state, tenantCom: updatedTenantComodities };

    //upravit vlastněnou nemovitost
    case UPDATE_WARDEN_COMODITY:
      const WardenComodityIndex = state.wardenCom.findIndex(
        (comodity) => comodity.id === action.comodityId
      );
      const updatedWardenComodity = new Comodity(
        action.comodityId,
        state.wardenCom[WardenComodityIndex].wardenId,
        state.wardenCom[WardenComodityIndex].tenantId,
        action.comodityData.name,
        action.comodityData.address,
        action.comodityData.description,
        state.wardenCom[WardenComodityIndex].currency
      );
      const updatedWardenComodities = [...state.wardenCom];
      updatedWardenComodities[WardenComodityIndex] = updatedWardenComodity;
      return { ...state, wardenCom: updatedWardenComodities };

    //připojit se k nemovitosti jako vlastník
    case JOIN_WARDEN_COMODITY:
      const Comodity1Index = state.comodities.findIndex(
        (comodity) => comodity.id === action.comodityId
      );

      const updated1Comodity = new Comodity(
        action.comodityId,
        action.comodityData.wardenId,
        state.comodities[Comodity1Index].tenantId,
        state.comodities[Comodity1Index].name,
        state.comodities[Comodity1Index].address,
        state.comodities[Comodity1Index].description,
        state.comodities[Comodity1Index].currency
      );
      const updated1Comodities = [...state.comodities];
      updated1Comodities[Comodity1Index] = updated1Comodity;
      return { ...state, comodities: updated1Comodities };

    //připojit se k nemovtiosti jako nájemník
    case JOIN_TENANT_COMODITY:
      const Comodity2Index = state.comodities.findIndex(
        (comodity) => comodity.id === action.comodityId
      );

      const updated2Comodity = new Comodity(
        action.comodityId,
        state.comodities[Comodity2Index].wardenId,
        action.comodityData.tenantId,
        state.comodities[Comodity2Index].name,
        state.comodities[Comodity2Index].address,
        state.comodities[Comodity2Index].description,
        state.comodities[Comodity2Index].currency
      );
      const updated2Comodities = [...state.comodities];
      updated2Comodities[Comodity2Index] = updated2Comodity;
      return { ...state, comodities: updated2Comodities };

    //odpojit se od najímané nemovitosti
    case DISSBOUND_TENANT_COMODITY:
      const TenantComodityDissIndex = state.tenantCom.findIndex(
        (comodity) => comodity.id === action.comodityId
      );
      const updatedTenant2Comodity = new Comodity(
        action.comodityId,
        state.tenantCom[TenantComodityDissIndex].wardenId,
        action.comodityData.tenantId,
        state.comodities[TenantComodityDissIndex].name,
        state.comodities[TenantComodityDissIndex].address,
        state.comodities[TenantComodityDissIndex].description,
        state.comodities[TenantComodityDissIndex].currency
      );
      const updatedTenant2Comodities = [...state.tenantCom];
      updatedTenant2Comodities[
        TenantComodityDissIndex
      ] = updatedTenant2Comodity;
      return { ...state, tenantCom: updatedTenant2Comodities };

    //odpojit se od vlastněné nemovitosti
    case DISSBOUND_WARDEN_COMODITY:
      const WardenComodityDissIndex = state.wardenCom.findIndex(
        (comodity) => comodity.id === action.comodityId
      );
      const updatedWarden2Comodity = new Comodity(
        action.comodityId,
        state.tenantCom[WardenComodityDissIndex].wardenId,
        action.comodityData.tenantId,
        state.comodities[WardenComodityDissIndex].name,
        state.comodities[WardenComodityDissIndex].address,
        state.comodities[WardenComodityDissIndex].description,
        state.comodities[WardenComodityDissIndex].currency
      );
      const updatedWarden2Comodities = [...state.wardenCom];
      updatedWarden2Comodities[
        WardenComodityDissIndex
      ] = updatedWarden2Comodity;
      return { ...state, wardenCom: updatedWarden2Comodities };

    default:
      return state;
  }
};

export default comoditiesReducer;
