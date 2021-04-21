/* eslint-disable no-underscore-dangle */
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
const APPLICATION_UPDATED = 'APPLICATION_UPDATED';

export function loadApplications(options, forceServer = false) {
  return async (dispatch, getState) => {
    const { data, query } = getState().applications;
    if (!Object.keys(data).length || forceServer) {
      dispatch({ type: APPLICATIONS_INIT });
      await new Promise((resolve) => setTimeout(() => resolve(), 2000));
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

export function updateApplication(appData) {
  return async (dispatch) => {
    dispatch({ type: APPLICATION_UPDATED, payload: appData });
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
    case APPLICATION_UPDATED: {
      const {
        app: newApp,
        analysis: newAnalysis,
        userAnalysis: newUserAnalysis,
      } = action.payload;

      const {
        apps,
        analyses,
        userAnalysis,
        currentUserAnalysis,
      } = state.data;
      const newState = { ...state.data };

      const appIndex = apps.findIndex((app) => app.appId === newApp.appId);
      if (appIndex === -1) {
        newState.apps = [newApp, ...newState.apps];
      } else {
        newState.apps[appIndex] = newApp;
      }

      const analysisIndex = analyses.findIndex((analysis) => analysis._id === newAnalysis._id);
      if (analysisIndex === -1) {
        newState.analyses = [newAnalysis, ...newState.analyses];
      } else {
        newState.analyses[analysisIndex] = newAnalysis;
      }

      const currentUserAnalysisIndex = currentUserAnalysis.findIndex(
        (cua) => cua._id === newUserAnalysis._id,
      );
      if (currentUserAnalysisIndex === -1) {
        newState.currentUserAnalysis = [newUserAnalysis, ...newState.currentUserAnalysis];
        const userAnalysisIndex = userAnalysis.findIndex(
          (ua) => ua._id === newUserAnalysis.analysisId,
        );
        if (userAnalysisIndex === -1) {
          newState.userAnalysis = [
            { _id: newUserAnalysis.analysisId, count: 1 }, ...newState.userAnalysis,
          ];
        } else {
          newState.userAnalysis[userAnalysisIndex].count += 1;
        }
      } else {
        newState.currentUserAnalysis[currentUserAnalysisIndex] = newUserAnalysis;
      }

      return { ...state, data: newState };
    }
    default:
      return state;
  }
}
