import { apiRequest } from '@app/utils';

const initialState = {
  isLoading: false,
  error: null,
  data: [],
};

const APPLICATIONS_INIT = 'APPLICATIONS_INIT';
const APPLICATIONS_LOADED = 'APPLICATIONS_LOADED';
const APPLICATIONS_ERROR = 'APPLICATIONS_ERROR';

export function loadApplications(options, forceServer = false) {
  return async (dispatch, getState) => {
    const { data } = getState().applications;
    if (!Object.keys(data).length || forceServer) {
      dispatch({ type: APPLICATIONS_INIT });
      try {
        const json = await apiRequest('GET', '/discover-apps', options);
        dispatch({ type: APPLICATIONS_LOADED, payload: json.data });
      } catch (error) {
        dispatch({ type: APPLICATIONS_ERROR, payload: error });
      }
    }
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
    default:
      return state;
  }
}
