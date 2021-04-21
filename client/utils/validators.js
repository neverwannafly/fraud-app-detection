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
  isUrlValid: (string) => {
    const urlRegExp = 'https:..(....)';
    const found = string.match(urlRegExp);
    if(found==null){
      return -1;
    }
    if (found.length!=2) {
      return -1;
    }
    if (found[1]==='play') {
      console.log("play-store");
      return 1;
    } else if (found[1]==='apps') {
      console.log("ios-store");
      return 0;
    }
    return -1;
  },
};
