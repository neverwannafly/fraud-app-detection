import history from '@app/history';

const navigateTo = (url) => () => {
  history.push(url);
};

export default navigateTo;
