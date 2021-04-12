import { getRandomName } from '@app/utils';

const initialState = {
  displayName: '',
  actualName: '',
  iconPath: '',
  color: '',
};
const randomClient = getRandomName();

export default function reducer(state = {
  ...initialState,
  ...randomClient,
}, action) {
  switch (action.type) {
    default:
      return state;
  }
}
