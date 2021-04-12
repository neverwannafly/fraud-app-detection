import { getRandomName } from '@app/utils';

const initialState = {
  displayName: '',
  actualName: '',
  iconPath: '',
  color: '',
  ...getRandomName(),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
