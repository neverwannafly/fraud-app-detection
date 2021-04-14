export default {
  isEmailValid: (email) => {
    if (email === '') return true;
    const emailRegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailRegExp.test(email.toLowerCase());
  },
  isStringValid: (string) => {
    const stringRegExp = /^\w*$/;
    return stringRegExp.test(string);
  },
};
