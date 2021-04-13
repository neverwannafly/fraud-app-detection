import { apiRequest } from '@app/utils';

const initialState = {
  isLoading: false,
  error: null,
  data: [],
  query: '',
};

const APPLICATIONS_INIT = 'APPLICATIONS_INIT';
const APPLICATIONS_LOADED = 'APPLICATIONS_LOADED';
const APPLICATIONS_ERROR = 'APPLICATIONS_ERROR';
const APPLICATIONS_QUERY_CHANGED = 'APPLICATIONS_QUERY_CHANGED';

export function loadApplications(options, forceServer = false) {
  return async (dispatch, getState) => {
    const { data, query } = getState().applications;
    if (!Object.keys(data).length || forceServer) {
      dispatch({ type: APPLICATIONS_INIT });
      try {
        const json = await apiRequest('GET', '/discover-apps', { query, ...options });
        if (json.success) {
          dispatch({ type: APPLICATIONS_LOADED, payload: json.data });
        } else {
          dispatch({ type: APPLICATIONS_ERROR, payload: json.error });
        }
      } catch (error) {
        dispatch({ type: APPLICATIONS_ERROR, payload: error });
      }
    }
  };
}

export function changeQuery(value, options) {
  return async (dispatch) => {
    dispatch({ type: APPLICATIONS_QUERY_CHANGED, payload: value });
    dispatch(loadApplications(options, true));
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case APPLICATIONS_INIT: return {
      ...state,
      isLoading: true,
    };
    case APPLICATIONS_LOADED: return {
      ...state,
      data: action.payload,
      isLoading: false,
    };
    case APPLICATIONS_ERROR: return {
      ...state,
      isLoading: false,
      error: action.payload,
    };
    case APPLICATIONS_QUERY_CHANGED: return {
      ...state,
      query: action.payload,
    };
    default:
      return state;
  }
}
