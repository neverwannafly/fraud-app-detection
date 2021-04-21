import { getRandomName, apiRequest } from '@app/utils';

const initialState = {
  displayName: '',
  actualName: '',
  iconPath: '',
  color: '',
  email: '',
  firstName: '',
  lastName: '',
  hasLoaded: false,
  ...getRandomName(),
};

const USER_LOAD_FINISHED = 'USER_LOAD_FINISHED';
const USER_DATA_CHANGED = 'USER_DATA_CHANGED';

export function loadUserData() {
  return async (dispatch, getState) => {
    const { hasLoaded, actualName: username } = getState().users;
    if (!hasLoaded) {
      const data = await apiRequest('GET', '/fetch-user', { username });
      dispatch({ type: USER_LOAD_FINISHED, payload: data });
    }
  };
}

export function changeUserData(data) {
  return (dispatch) => dispatch({ type: USER_DATA_CHANGED, payload: data });
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOAD_FINISHED:
      return {
        ...state,
        ...action.payload,
      };
    case USER_DATA_CHANGED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
