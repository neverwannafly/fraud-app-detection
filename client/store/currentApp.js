/* eslint-disable no-underscore-dangle */
import { apiRequest } from '@app/utils';

const initialState = {
  currentAppId: null,
  isLoading: false,
  error: null,
  data: {},
};

const CURRENT_APP_INIT = 'CURRENT_APP_INIT';
const CURRENT_APP_LOADED = 'CURRENT_APP_LOADED';
const CURRENT_APP_ERROR = 'CURRENT_APP_ERROR';

export function loadApplication(options, forceServer = false) {
  return async (dispatch, getState) => {
    const { currentAppId } = getState().currentApplication;
    const { appId } = options;
    if (currentAppId !== appId || forceServer) {
      dispatch({ type: CURRENT_APP_INIT, payload: appId });
      await new Promise((resolve) => setTimeout(() => resolve(), 2000));
      try {
        const json = await apiRequest('GET', '/fetch-application', options);
        if (json.success) {
          dispatch({ type: CURRENT_APP_LOADED, payload: json.data });
        } else {
          dispatch({ type: CURRENT_APP_ERROR, payload: json.error });
        }
      } catch (error) {
        dispatch({ type: CURRENT_APP_ERROR, payload: error });
      }
    }
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CURRENT_APP_INIT: return {
      ...state,
      isLoading: true,
      currentAppId: action.payload,
    };
    case CURRENT_APP_LOADED: return {
      ...state,
      data: action.payload,
      isLoading: false,
    };
    case CURRENT_APP_ERROR: return {
      ...state,
      isLoading: false,
      error: action.payload,
    };
    default:
      return state;
  }
}
